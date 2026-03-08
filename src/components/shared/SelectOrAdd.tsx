import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
  searchable?: boolean;
  renderOption?: (item: T, isHighlighted: boolean) => ReactNode;
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
  searchable,
  renderOption,
}: SelectOrAddProps<T>) {
  const [mode, setMode] = useState<'select' | 'add'>('select');
  const [inputValue, setInputValue] = useState('');
  const [addError, setAddError] = useState('');

  const [filterText, setFilterText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = searchable
    ? options.filter(o => getLabel(o).toLowerCase().includes(filterText.toLowerCase())).slice(0, 3)
    : options;

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    setFilterText(value ? getLabel(value) : '');
  }, [value, getLabel]);

  const selectItem = useCallback((item: T) => {
    onChange(item);
    setFilterText(getLabel(item));
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onChange, getLabel]);

  const cancelAdd = () => {
    setMode('select');
    setInputValue('');
    setAddError('');
    if (searchable) {
      setFilterText(value ? getLabel(value) : '');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const total = filteredOptions.length + 1; // +1 for Add row
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % total);
      if (!isOpen) setIsOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + total) % total);
      if (!isOpen) setIsOpen(true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex === filteredOptions.length) {
        setMode('add');
        setIsOpen(false);
      } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        selectItem(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'Tab') {
      closeDropdown();
    }
  };

  // Compute dropdown position whenever it opens
  useEffect(() => {
    if (!searchable || !isOpen || !inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [searchable, isOpen]);

  // Click-outside detection (checks both the input container and the portaled list)
  useEffect(() => {
    if (!searchable || !isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inContainer = containerRef.current?.contains(target) ?? false;
      const inList = listRef.current?.contains(target) ?? false;
      if (!inContainer && !inList) closeDropdown();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchable, isOpen, closeDropdown]);

  // Sync value → filterText when dropdown is closed
  useEffect(() => {
    if (!searchable || isOpen) return;
    setFilterText(value ? getLabel(value) : '');
  }, [value, searchable, isOpen, getLabel]);

  // ScrollIntoView on keyboard nav
  useEffect(() => {
    if (!listRef.current || highlightedIndex < 0) return;
    const el = listRef.current.querySelectorAll<HTMLLIElement>('[data-idx]')[highlightedIndex];
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  const dropdown = isOpen && dropdownPos && createPortal(
    <ul
      ref={listRef}
      role="listbox"
      style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
      className="z-[200] bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      {filteredOptions.length === 0 && (
        <li className="px-3 py-2 text-sm text-gray-400 italic">No matches</li>
      )}

      {filteredOptions.map((option, idx) => (
        <li
          key={getKey(option)}
          data-idx={idx}
          role="option"
          aria-selected={value ? getKey(value) === getKey(option) : false}
          onMouseDown={e => { e.preventDefault(); selectItem(option); }}
          onMouseEnter={() => setHighlightedIndex(idx)}
          className={`px-3 py-2 text-sm cursor-pointer ${
            highlightedIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-50'
          } ${
            value && getKey(value) === getKey(option)
              ? 'font-medium text-blue-700' : 'text-gray-900'
          }`}
        >
          {renderOption ? renderOption(option, highlightedIndex === idx) : getLabel(option)}
        </li>
      ))}

      <li
        data-idx={filteredOptions.length}
        role="option"
        aria-selected={false}
        onMouseDown={e => { e.preventDefault(); setMode('add'); setIsOpen(false); }}
        onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
        className={`px-3 py-2 text-sm cursor-pointer border-t border-gray-100 ${
          highlightedIndex === filteredOptions.length
            ? 'bg-blue-50 text-blue-700' : 'text-blue-600 hover:bg-blue-50'
        }`}
      >
        + Add new…
      </li>
    </ul>,
    document.body
  );

  return (
    <div ref={containerRef} className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {!searchable && mode === 'select' && (
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

      {searchable && mode === 'select' && (
        <input
          ref={inputRef}
          type="text"
          value={filterText}
          onChange={e => { setFilterText(e.target.value); setIsOpen(true); setHighlightedIndex(-1); }}
          onFocus={() => { inputRef.current?.select(); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400' : 'border-gray-300'
          }`}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
      )}

      {dropdown}

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
