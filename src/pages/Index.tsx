import { useGameState } from '@/hooks/useGameState';
import GameGrid from '@/components/GameGrid';
import ControlPanel from '@/components/ControlPanel';
import { Position, BuildingType } from '@/types/game';

const Index = () => {
  const {
    gameState,
    selectUnit,
    moveSelectedUnits,
    spawnUnit,
    buildStructure,
    togglePause,
    setGameSpeed,
  } = useGameState();

  const handleCellClick = (position: Position) => {
    if (gameState.selectedUnits.length > 0) {
      moveSelectedUnits(position);
    }
  };

  const handleBuildStructure = (type: BuildingType) => {
    const playerBase = gameState.buildings.find(b => b.team === 'player' && b.type === 'base');
    if (playerBase) {
      const offset = Math.floor(Math.random() * 3) - 1;
      buildStructure(type, {
        x: playerBase.position.x + 2,
        y: playerBase.position.y + offset,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            ⚔️ TACTICAL COMMAND
          </h1>
          <p className="text-slate-400 text-sm">Real-time strategy warfare</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="bg-slate-900/50 p-4 rounded-lg border-2 border-slate-700/50 backdrop-blur">
            <GameGrid
              units={gameState.units}
              buildings={gameState.buildings}
              onCellClick={handleCellClick}
              onUnitClick={selectUnit}
            />
          </div>

          <div>
            <ControlPanel
              resources={gameState.resources}
              isPaused={gameState.isPaused}
              gameSpeed={gameState.gameSpeed}
              selectedUnitsCount={gameState.selectedUnits.length}
              onSpawnUnit={spawnUnit}
              onBuildStructure={handleBuildStructure}
              onTogglePause={togglePause}
              onSpeedChange={setGameSpeed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
