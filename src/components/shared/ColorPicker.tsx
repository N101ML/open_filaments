import { useState } from 'react';
import { isValidHex, normalizeHex } from '../../utils/colorUtils';
import { Button } from './Button';

interface ColorPickerProps {
  existingHexes: string[];
  onAdd: (name: string, hex: string) => void;
  onCancel: () => void;
}

export function ColorPicker({ existingHexes, onAdd, onCancel }: ColorPickerProps) {
  const [hex, setHex] = useState('#3182ce');
  const [hexInput, setHexInput] = useState('#3182ce');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleColorInput = (val: string) => {
    setHexInput(val);
    if (isValidHex(val)) {
      setHex(normalizeHex(val));
      setError('');
    }
  };

  const handleNativeColor = (val: string) => {
    setHex(val);
    setHexInput(val);
    setError('');
  };

  const handleBlur = () => {
    if (!isValidHex(hexInput)) {
      setError('Invalid hex color (e.g. #ff0000)');
    } else {
      setHex(normalizeHex(hexInput));
      setError('');
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError('Color name is required.'); return; }
    if (!isValidHex(hexInput)) { setError('Invalid hex color.'); return; }
    const normalized = normalizeHex(hexInput);
    if (existingHexes.includes(normalized)) {
      setError('This color already exists.');
      return;
    }
    setError('');
    onAdd(name.trim(), normalized);
  };

  return (
    <div className="space-y-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
      <p className="text-sm font-medium text-gray-700">Add new color</p>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Color name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Galaxy Blue"
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Hex value</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={hex}
            onChange={(e) => handleNativeColor(e.target.value)}
            className="w-9 h-9 rounded cursor-pointer border border-gray-300 p-0.5 bg-white"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleColorInput(e.target.value)}
            onBlur={handleBlur}
            placeholder="#000000"
            maxLength={7}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            className="w-9 h-9 rounded-lg border border-gray-300 flex-shrink-0"
            style={{ backgroundColor: hex }}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit}>Add Color</Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
