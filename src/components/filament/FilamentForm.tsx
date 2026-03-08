import { useState } from 'react';
import type { Filament, FilamentColor, Brand, Material } from '../../types';
import { useFilament } from '../../context/FilamentContext';
import { validateFilamentForm, hasErrors } from '../../utils/validation';
import { normalizeHex } from '../../utils/colorUtils';
import { SelectOrAdd } from '../shared/SelectOrAdd';
import { ColorPicker } from '../shared/ColorPicker';
import { ColorSwatch } from '../shared/ColorSwatch';
import { Button } from '../shared/Button';

interface FilamentFormProps {
  initial?: Filament;
  onClose: () => void;
}

export function FilamentForm({ initial, onClose }: FilamentFormProps) {
  const { state, dispatch } = useFilament();

  const [brandId, setBrandId] = useState(initial?.brandId ?? '');
  const [materialId, setMaterialId] = useState(initial?.materialId ?? '');
  const [colorId, setColorId] = useState(initial?.colorId ?? '');
  const [weightKg, setWeightKg] = useState<string>(initial ? String(initial.weightKg) : '1');
  const [priceUsd, setPriceUsd] = useState<string>(initial ? String(initial.priceUsd) : '');
  const [errors, setErrors] = useState<ReturnType<typeof validateFilamentForm>>({});

  const selectedBrand = state.brands.find((b) => b.id === brandId) ?? null;
  const selectedMaterial = state.materials.find((m) => m.id === materialId) ?? null;
  const selectedColor = state.colors.find((c) => c.id === colorId) ?? null;

  const handleAddBrand = (name: string): boolean => {
    const exists = state.brands.some((b) => b.name.toLowerCase() === name.toLowerCase());
    if (exists) return false;
    dispatch({ type: 'ADD_BRAND', payload: { name } });
    // Select the newly added brand by finding it after next render — use a workaround:
    // The reducer adds it synchronously in dispatch, but state won't update until re-render.
    // We'll set brandId by name after the dispatch; we need to wait for state.
    // Since we can't await dispatch, we defer by setting a pending brand name.
    setPendingBrandName(name);
    return true;
  };

  const handleAddMaterial = (name: string): boolean => {
    const exists = state.materials.some((m) => m.name.toLowerCase() === name.toLowerCase());
    if (exists) return false;
    dispatch({ type: 'ADD_MATERIAL', payload: { name } });
    setPendingMaterialName(name);
    return true;
  };

  const handleAddColor = (name: string, hex: string): void => {
    const normalized = normalizeHex(hex);
    const exists = state.colors.some((c) => c.hex === normalized);
    if (exists) return;
    const id = crypto.randomUUID();
    dispatch({ type: 'ADD_COLOR', payload: { id, name, hex: normalized } });
    setColorId(id);
  };

  // These track pending brand/material names to auto-select after dispatch updates state
  const [pendingBrandName, setPendingBrandName] = useState('');
  const [pendingMaterialName, setPendingMaterialName] = useState('');

  // Auto-select newly added brand/material once state updates
  if (pendingBrandName) {
    const found = state.brands.find((b) => b.name.toLowerCase() === pendingBrandName.toLowerCase());
    if (found) { setBrandId(found.id); setPendingBrandName(''); }
  }
  if (pendingMaterialName) {
    const found = state.materials.find((m) => m.name.toLowerCase() === pendingMaterialName.toLowerCase());
    if (found) { setMaterialId(found.id); setPendingMaterialName(''); }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { brandId, materialId, colorId, weightKg, priceUsd };
    const errs = validateFilamentForm(formData);
    setErrors(errs);
    if (hasErrors(errs)) return;

    if (initial) {
      dispatch({
        type: 'UPDATE_FILAMENT',
        payload: {
          ...initial,
          brandId,
          materialId,
          colorId,
          weightKg: Number(weightKg),
          priceUsd: Number(priceUsd),
        },
      });
    } else {
      dispatch({
        type: 'ADD_FILAMENT',
        payload: {
          id: crypto.randomUUID(),
          brandId,
          materialId,
          colorId,
          weightKg: Number(weightKg),
          priceUsd: Number(priceUsd),
          createdAt: Date.now(),
        },
      });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectOrAdd<Brand>
        label="Brand"
        options={state.brands}
        value={selectedBrand}
        onChange={(b) => setBrandId(b?.id ?? '')}
        onAddNew={handleAddBrand}
        getKey={(b) => b.id}
        getLabel={(b) => b.name}
        error={errors.brandId}
        placeholder="Select brand…"
      />

      <SelectOrAdd<Material>
        label="Material"
        options={state.materials}
        value={selectedMaterial}
        onChange={(m) => setMaterialId(m?.id ?? '')}
        onAddNew={handleAddMaterial}
        getKey={(m) => m.id}
        getLabel={(m) => m.name}
        error={errors.materialId}
        placeholder="Select material…"
      />

      <SelectOrAdd<FilamentColor>
        label="Color"
        options={state.colors}
        value={selectedColor}
        onChange={(c) => setColorId(c?.id ?? '')}
        onAddNew={() => false} // not used — custom slot handles adding
        getKey={(c) => c.id}
        getLabel={(c) => c.name}
        addNewSlot={(cancelFn) => (
          <ColorPicker
            existingHexes={state.colors.map((c) => c.hex)}
            onAdd={(name, hex) => { handleAddColor(name, hex); cancelFn(); }}
            onCancel={cancelFn}
          />
        )}
        error={errors.colorId}
        placeholder="Select color…"
      />

      {selectedColor && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ColorSwatch hex={selectedColor.hex} size="md" />
          <span>{selectedColor.name}</span>
          <span className="font-mono text-xs text-gray-400">{selectedColor.hex}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            min="0.01"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.weightKg ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.weightKg && <p className="text-xs text-red-600 mt-0.5">{errors.weightKg}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.priceUsd ? 'border-red-400' : 'border-gray-300'}`}
          />
          {errors.priceUsd && <p className="text-xs text-red-600 mt-0.5">{errors.priceUsd}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Filament'}</Button>
      </div>
    </form>
  );
}
