export type UnitType = 'infantry' | 'tank' | 'aircraft';
export type BuildingType = 'base' | 'barracks' | 'factory' | 'airfield';
export type Team = 'player' | 'enemy';

export interface Position {
  x: number;
  y: number;
}

export interface Unit {
  id: string;
  type: UnitType;
  team: Team;
  position: Position;
  health: number;
  maxHealth: number;
  damage: number;
  range: number;
  speed: number;
  isSelected: boolean;
  targetId?: string;
}

export interface Building {
  id: string;
  type: BuildingType;
  team: Team;
  position: Position;
  health: number;
  maxHealth: number;
  cost: number;
  isConstructing: boolean;
  constructionProgress: number;
}

export interface GameState {
  units: Unit[];
  buildings: Building[];
  selectedUnits: string[];
  resources: number;
  gameSpeed: number;
  isPaused: boolean;
}
