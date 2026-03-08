import { useState, type ReactNode } from 'react';
import { Button } from './Button';

interface SelectOrAddProps<T> {
  label: string;
  options: T[];
  value: T | null;
  onChange: (item: T | null) => void;
  onAddNew: (inputValue: string) => boolean; // returns false if duplicate
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  // render prop: receives cancelFn so custom UI can dismiss add mode
  addNewSlot?: (cancelFn: () => void) => ReactNode;
  error?: string;
  placeholder?: string;
}

export function SelectOrAdd<T>({
  label,
  options,
  value,
  onChange,
  onAddNew,
  getKey,
  getLabel,
  addNewSlot,
  error,
  placeholder = 'Select...',
}: SelectOrAddProps<T>) {
  const [mode, setMode] = useState<'select' | 'add'>('select');
  const [inputValue, setInputValue] = useState('');
  const [addError, setAddError] = useState('');

  const cancelAdd = () => {
    setMode('select');
    setInputValue('');
    setAddError('');
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === '__add__') {
      setMode('add');
      setInputValue('');
      setAddError('');
      return;
    }
    const found = options.find((o) => getKey(o) === id) ?? null;
    onChange(found);
  };

  const handleAddSubmit = () => {
    if (!inputValue.trim()) { setAddError('Name is required.'); return; }
    const success = onAddNew(inputValue.trim());
    if (!success) { setAddError('Already exists.'); return; }
    cancelAdd();
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {mode === 'select' && (
        <select
          value={value ? getKey(value) : ''}
          onChange={handleSelectChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400' : 'border-gray-300'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={getKey(o)} value={getKey(o)}>
              {getLabel(o)}
            </option>
          ))}
          <option value="__add__">+ Add new…</option>
        </select>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}

      {mode === 'add' && addNewSlot && addNewSlot(cancelAdd)}

      {mode === 'add' && !addNewSlot && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
          <p className="text-sm font-medium text-gray-700">Add new {label.toLowerCase()}</p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setAddError(''); }}
            placeholder={`e.g. My ${label}`}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(); if (e.key === 'Escape') cancelAdd(); }}
          />
          {addError && <p className="text-xs text-red-600">{addError}</p>}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddSubmit}>Add</Button>
            <Button size="sm" variant="ghost" onClick={cancelAdd}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
