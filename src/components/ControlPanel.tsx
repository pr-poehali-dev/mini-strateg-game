import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { UnitType, BuildingType } from '@/types/game';

interface ControlPanelProps {
  resources: number;
  isPaused: boolean;
  gameSpeed: number;
  selectedUnitsCount: number;
  onSpawnUnit: (type: UnitType) => void;
  onBuildStructure: (type: BuildingType) => void;
  onTogglePause: () => void;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel = ({
  resources,
  isPaused,
  gameSpeed,
  selectedUnitsCount,
  onSpawnUnit,
  onBuildStructure,
  onTogglePause,
  onSpeedChange,
}: ControlPanelProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-slate-900/90 border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="Coins" size={20} className="text-yellow-500" />
            <span className="text-2xl font-bold text-white">{resources}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isPaused ? 'default' : 'outline'}
              size="sm"
              onClick={onTogglePause}
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <Icon name={isPaused ? 'Play' : 'Pause'} size={16} />
            </Button>
            <Button
              variant={gameSpeed === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(1)}
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              1x
            </Button>
            <Button
              variant={gameSpeed === 2 ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(2)}
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              2x
            </Button>
          </div>
        </div>

        {selectedUnitsCount > 0 && (
          <div className="mb-4 p-2 bg-purple-500/20 border border-purple-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-purple-200">
              <Icon name="Users" size={16} />
              <span className="text-sm">Выбрано юнитов: {selectedUnitsCount}</span>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-slate-900/90 border-slate-700">
        <h3 className="text-sm font-semibold mb-3 text-slate-300 flex items-center gap-2">
          <Icon name="Swords" size={16} />
          Создание юнитов
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={() => onSpawnUnit('infantry')}
            className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
            size="sm"
          >
            <Icon name="Users" size={16} className="mr-2" />
            <span className="flex-1 text-left">Пехота</span>
            <span className="text-xs opacity-75">50💰</span>
          </Button>
          <Button
            onClick={() => onSpawnUnit('tank')}
            className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
            size="sm"
          >
            <Icon name="Truck" size={16} className="mr-2" />
            <span className="flex-1 text-left">Танк</span>
            <span className="text-xs opacity-75">150💰</span>
          </Button>
          <Button
            onClick={() => onSpawnUnit('aircraft')}
            className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
            size="sm"
          >
            <Icon name="Plane" size={16} className="mr-2" />
            <span className="flex-1 text-left">Авиация</span>
            <span className="text-xs opacity-75">200💰</span>
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-slate-900/90 border-slate-700">
        <h3 className="text-sm font-semibold mb-3 text-slate-300 flex items-center gap-2">
          <Icon name="Building" size={16} />
          Строительство
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={() => onBuildStructure('barracks')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
            size="sm"
          >
            <Icon name="Home" size={16} className="mr-2" />
            <span className="flex-1 text-left">Казармы</span>
            <span className="text-xs opacity-75">200💰</span>
          </Button>
          <Button
            onClick={() => onBuildStructure('factory')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
            size="sm"
          >
            <Icon name="Factory" size={16} className="mr-2" />
            <span className="flex-1 text-left">Завод</span>
            <span className="text-xs opacity-75">300💰</span>
          </Button>
          <Button
            onClick={() => onBuildStructure('airfield')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
            size="sm"
          >
            <Icon name="PlaneLanding" size={16} className="mr-2" />
            <span className="flex-1 text-left">Аэродром</span>
            <span className="text-xs opacity-75">350💰</span>
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-slate-900/90 border-slate-700">
        <h3 className="text-sm font-semibold mb-2 text-slate-300 flex items-center gap-2">
          <Icon name="Info" size={16} />
          Управление
        </h3>
        <div className="text-xs text-slate-400 space-y-1">
          <p>• Клик по юниту - выбор</p>
          <p>• Shift+клик - групповой выбор</p>
          <p>• Клик по полю - перемещение</p>
          <p>• Строительство - автопостройка</p>
        </div>
      </Card>
    </div>
  );
};

export default ControlPanel;
