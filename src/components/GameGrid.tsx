import { Unit, Building, Position } from '@/types/game';
import Icon from '@/components/ui/icon';

interface GameGridProps {
  units: Unit[];
  buildings: Building[];
  onCellClick: (position: Position) => void;
  onUnitClick: (unitId: string, shiftKey: boolean) => void;
  gridSize?: number;
}

const GameGrid = ({ units, buildings, onCellClick, onUnitClick, gridSize = 20 }: GameGridProps) => {
  const cellSize = 40;

  const getUnitIcon = (type: string) => {
    switch (type) {
      case 'infantry': return 'Users';
      case 'tank': return 'Truck';
      case 'aircraft': return 'Plane';
      default: return 'Circle';
    }
  };

  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'base': return 'Castle';
      case 'barracks': return 'Home';
      case 'factory': return 'Factory';
      case 'airfield': return 'PlaneLanding';
      default: return 'Building';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 overflow-hidden">
      <svg
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        className="block"
      >
        <defs>
          <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <rect width={cellSize} height={cellSize} fill="transparent" />
            <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {Array.from({ length: gridSize }).map((_, y) =>
          Array.from({ length: gridSize }).map((_, x) => (
            <rect
              key={`cell-${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill="transparent"
              className="cursor-pointer hover:fill-blue-500/10 transition-colors"
              onClick={() => onCellClick({ x, y })}
            />
          ))
        )}

        {buildings.map((building) => (
          <g key={building.id}>
            <rect
              x={building.position.x * cellSize + 5}
              y={building.position.y * cellSize + 5}
              width={cellSize - 10}
              height={cellSize - 10}
              fill={building.team === 'player' ? '#0EA5E9' : '#ea384c'}
              opacity={building.isConstructing ? 0.5 : 0.8}
              rx="4"
              className="transition-all"
            />
            {building.isConstructing && (
              <rect
                x={building.position.x * cellSize + 5}
                y={building.position.y * cellSize + cellSize - 8}
                width={(cellSize - 10) * (building.constructionProgress / 100)}
                height={3}
                fill="#8B5CF6"
              />
            )}
            <foreignObject
              x={building.position.x * cellSize + 8}
              y={building.position.y * cellSize + 8}
              width={cellSize - 16}
              height={cellSize - 16}
            >
              <div className="flex items-center justify-center h-full">
                <Icon name={getBuildingIcon(building.type)} size={20} className="text-white" />
              </div>
            </foreignObject>
          </g>
        ))}

        {units.map((unit) => (
          <g
            key={unit.id}
            onClick={(e) => {
              e.stopPropagation();
              onUnitClick(unit.id, e.shiftKey);
            }}
            className="cursor-pointer"
          >
            <circle
              cx={unit.position.x * cellSize + cellSize / 2}
              cy={unit.position.y * cellSize + cellSize / 2}
              r={unit.isSelected ? 18 : 15}
              fill={unit.team === 'player' ? '#0EA5E9' : '#ea384c'}
              className="transition-all"
              opacity={0.9}
            />
            {unit.isSelected && (
              <circle
                cx={unit.position.x * cellSize + cellSize / 2}
                cy={unit.position.y * cellSize + cellSize / 2}
                r={20}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
            <foreignObject
              x={unit.position.x * cellSize + cellSize / 2 - 10}
              y={unit.position.y * cellSize + cellSize / 2 - 10}
              width={20}
              height={20}
            >
              <div className="flex items-center justify-center h-full">
                <Icon name={getUnitIcon(unit.type)} size={14} className="text-white" />
              </div>
            </foreignObject>
            <rect
              x={unit.position.x * cellSize + 5}
              y={unit.position.y * cellSize - 5}
              width={cellSize - 10}
              height={3}
              fill="#1A1F2C"
              rx="1.5"
            />
            <rect
              x={unit.position.x * cellSize + 5}
              y={unit.position.y * cellSize - 5}
              width={(cellSize - 10) * (unit.health / unit.maxHealth)}
              height={3}
              fill={unit.health > unit.maxHealth * 0.5 ? '#22c55e' : unit.health > unit.maxHealth * 0.25 ? '#f59e0b' : '#ef4444'}
              rx="1.5"
              className="transition-all"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default GameGrid;
