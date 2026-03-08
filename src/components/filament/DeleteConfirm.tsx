import type { Filament } from '../../types';
import { useFilament } from '../../context/FilamentContext';
import { Button } from '../shared/Button';

interface DeleteConfirmProps {
  filament: Filament;
  onClose: () => void;
}

export function DeleteConfirm({ filament, onClose }: DeleteConfirmProps) {
  const { state, dispatch } = useFilament();

  const brand = state.brands.find((b) => b.id === filament.brandId)?.name ?? 'Unknown';
  const material = state.materials.find((m) => m.id === filament.materialId)?.name ?? 'Unknown';
  const color = state.colors.find((c) => c.id === filament.colorId)?.name ?? 'Unknown';

  const handleDelete = () => {
    dispatch({ type: 'DELETE_FILAMENT', payload: filament.id });
    onClose();
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Are you sure you want to delete this filament?
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 space-y-1">
        <p><span className="font-medium">Brand:</span> {brand}</p>
        <p><span className="font-medium">Material:</span> {material}</p>
        <p><span className="font-medium">Color:</span> {color}</p>
        <p><span className="font-medium">Weight:</span> {filament.weightKg} kg</p>
        <p><span className="font-medium">Price:</span> ${filament.priceUsd.toFixed(2)}</p>
      </div>
      <p className="text-sm text-gray-500">This action cannot be undone.</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
}
