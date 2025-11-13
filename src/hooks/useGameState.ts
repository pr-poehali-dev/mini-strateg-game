import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Unit, Building, Position, UnitType, BuildingType } from '@/types/game';

const GRID_SIZE = 20;
const UNIT_CONFIGS = {
  infantry: { health: 100, damage: 10, range: 2, speed: 1.5, cost: 50 },
  tank: { health: 300, damage: 40, range: 3, speed: 1, cost: 150 },
  aircraft: { health: 150, damage: 25, range: 5, speed: 3, cost: 200 },
};

const BUILDING_CONFIGS = {
  base: { health: 1000, cost: 0 },
  barracks: { health: 500, cost: 200 },
  factory: { health: 600, cost: 300 },
  airfield: { health: 400, cost: 350 },
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    units: [],
    buildings: [],
    selectedUnits: [],
    resources: 1000,
    gameSpeed: 1,
    isPaused: false,
  });

  const gameLoopRef = useRef<number>();

  const distance = (a: Position, b: Position) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  const initializeGame = useCallback(() => {
    const playerBase: Building = {
      id: 'player-base',
      type: 'base',
      team: 'player',
      position: { x: 2, y: GRID_SIZE / 2 },
      health: 1000,
      maxHealth: 1000,
      cost: 0,
      isConstructing: false,
      constructionProgress: 100,
    };

    const enemyBase: Building = {
      id: 'enemy-base',
      type: 'base',
      team: 'enemy',
      position: { x: GRID_SIZE - 3, y: GRID_SIZE / 2 },
      health: 1000,
      maxHealth: 1000,
      cost: 0,
      isConstructing: false,
      constructionProgress: 100,
    };

    const initialUnits: Unit[] = [
      {
        id: 'player-unit-1',
        type: 'infantry',
        team: 'player',
        position: { x: 4, y: GRID_SIZE / 2 },
        health: 100,
        maxHealth: 100,
        damage: 10,
        range: 2,
        speed: 1.5,
        isSelected: false,
      },
      {
        id: 'player-unit-2',
        type: 'tank',
        team: 'player',
        position: { x: 5, y: GRID_SIZE / 2 + 1 },
        health: 300,
        maxHealth: 300,
        damage: 40,
        range: 3,
        speed: 1,
        isSelected: false,
      },
      {
        id: 'enemy-unit-1',
        type: 'infantry',
        team: 'enemy',
        position: { x: GRID_SIZE - 5, y: GRID_SIZE / 2 },
        health: 100,
        maxHealth: 100,
        damage: 10,
        range: 2,
        speed: 1.5,
        isSelected: false,
      },
    ];

    setGameState(prev => ({
      ...prev,
      units: initialUnits,
      buildings: [playerBase, enemyBase],
    }));
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const selectUnit = useCallback((unitId: string, addToSelection: boolean = false) => {
    setGameState(prev => {
      const newSelectedUnits = addToSelection
        ? prev.selectedUnits.includes(unitId)
          ? prev.selectedUnits.filter(id => id !== unitId)
          : [...prev.selectedUnits, unitId]
        : [unitId];

      return {
        ...prev,
        selectedUnits: newSelectedUnits,
        units: prev.units.map(unit => ({
          ...unit,
          isSelected: newSelectedUnits.includes(unit.id),
        })),
      };
    });
  }, []);

  const moveSelectedUnits = useCallback((target: Position) => {
    setGameState(prev => {
      const updatedUnits = prev.units.map(unit => {
        if (prev.selectedUnits.includes(unit.id)) {
          return {
            ...unit,
            targetPosition: target,
          };
        }
        return unit;
      });

      return { ...prev, units: updatedUnits };
    });
  }, []);

  const spawnUnit = useCallback((type: UnitType) => {
    const config = UNIT_CONFIGS[type];
    if (gameState.resources < config.cost) return;

    const playerBase = gameState.buildings.find(b => b.team === 'player' && b.type === 'base');
    if (!playerBase) return;

    const newUnit: Unit = {
      id: `player-unit-${Date.now()}`,
      type,
      team: 'player',
      position: { x: playerBase.position.x + 2, y: playerBase.position.y },
      health: config.health,
      maxHealth: config.health,
      damage: config.damage,
      range: config.range,
      speed: config.speed,
      isSelected: false,
    };

    setGameState(prev => ({
      ...prev,
      units: [...prev.units, newUnit],
      resources: prev.resources - config.cost,
    }));
  }, [gameState.resources, gameState.buildings]);

  const buildStructure = useCallback((type: BuildingType, position: Position) => {
    const config = BUILDING_CONFIGS[type];
    if (gameState.resources < config.cost) return;

    const newBuilding: Building = {
      id: `player-building-${Date.now()}`,
      type,
      team: 'player',
      position,
      health: config.health,
      maxHealth: config.health,
      cost: config.cost,
      isConstructing: true,
      constructionProgress: 0,
    };

    setGameState(prev => ({
      ...prev,
      buildings: [...prev.buildings, newBuilding],
      resources: prev.resources - config.cost,
    }));
  }, [gameState.resources]);

  useEffect(() => {
    if (gameState.isPaused) return;

    const updateGame = () => {
      setGameState(prev => {
        let newUnits = [...prev.units];
        const newBuildings = prev.buildings.map(building => {
          if (building.isConstructing && building.constructionProgress < 100) {
            return {
              ...building,
              constructionProgress: Math.min(building.constructionProgress + 0.5, 100),
              isConstructing: building.constructionProgress + 0.5 < 100,
            };
          }
          return building;
        });

        newUnits = newUnits.map(unit => {
          if (unit.team === 'enemy') {
            const playerUnits = newUnits.filter(u => u.team === 'player' && u.health > 0);
            if (playerUnits.length > 0) {
              const nearest = playerUnits.reduce((closest, current) => {
                const distCurrent = distance(unit.position, current.position);
                const distClosest = distance(unit.position, closest.position);
                return distCurrent < distClosest ? current : closest;
              });

              const dist = distance(unit.position, nearest.position);
              
              if (dist <= unit.range) {
                return { ...unit, targetId: nearest.id };
              } else {
                const dx = nearest.position.x - unit.position.x;
                const dy = nearest.position.y - unit.position.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                return {
                  ...unit,
                  position: {
                    x: unit.position.x + (dx / length) * unit.speed * 0.05,
                    y: unit.position.y + (dy / length) * unit.speed * 0.05,
                  },
                  targetId: undefined,
                };
              }
            }
          }

          if (unit.targetId) {
            const target = newUnits.find(u => u.id === unit.targetId);
            if (target && target.health > 0) {
              const dist = distance(unit.position, target.position);
              if (dist <= unit.range) {
                return unit;
              }
            }
            return { ...unit, targetId: undefined };
          }

          return unit;
        });

        newUnits = newUnits.map(unit => {
          if (unit.targetId) {
            const target = newUnits.find(u => u.id === unit.targetId);
            if (target) {
              const newTarget = {
                ...target,
                health: Math.max(0, target.health - unit.damage * 0.1),
              };
              const index = newUnits.findIndex(u => u.id === target.id);
              newUnits[index] = newTarget;
            }
          }
          return unit;
        });

        newUnits = newUnits.filter(unit => unit.health > 0);

        return {
          ...prev,
          units: newUnits,
          buildings: newBuildings,
        };
      });
    };

    gameLoopRef.current = window.setInterval(updateGame, 100 / gameState.gameSpeed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPaused, gameState.gameSpeed]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const setGameSpeed = useCallback((speed: number) => {
    setGameState(prev => ({ ...prev, gameSpeed: speed }));
  }, []);

  return {
    gameState,
    selectUnit,
    moveSelectedUnits,
    spawnUnit,
    buildStructure,
    togglePause,
    setGameSpeed,
  };
};
