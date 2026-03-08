import type { Filament } from '../../types';
import { useFilament } from '../../context/FilamentContext';
import { getContrastColor } from '../../utils/colorUtils';
import { Button } from '../shared/Button';

interface FilamentCardProps {
  filament: Filament;
}

export function FilamentCard({ filament }: FilamentCardProps) {
  const { state, setModal } = useFilament();

  const brand = state.brands.find((b) => b.id === filament.brandId)?.name ?? 'Unknown';
  const material = state.materials.find((m) => m.id === filament.materialId)?.name ?? 'Unknown';
  const color = state.colors.find((c) => c.id === filament.colorId);

  const colorHex = color?.hex ?? '#cccccc';
  const textColor = getContrastColor(colorHex);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Color bar */}
      <div
        className="h-16 flex items-end px-4 pb-2"
        style={{ backgroundColor: colorHex }}
      >
        <span
          className="text-xs font-semibold tracking-wide opacity-90"
          style={{ color: textColor }}
        >
          {color?.name ?? 'Unknown'}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <p className="text-base font-semibold text-gray-900">{brand}</p>
          <p className="text-sm text-gray-500">{material}</p>
        </div>

        <div className="flex justify-between text-sm text-gray-700">
          <span>{filament.weightKg} kg</span>
          <span className="font-medium">${filament.priceUsd.toFixed(2)}</span>
        </div>

        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={() => setModal({ type: 'edit', filament })}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="flex-1"
            onClick={() => setModal({ type: 'delete', filament })}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
