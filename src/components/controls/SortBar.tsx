import type { SortOption } from '../../types';
import { useFilament } from '../../context/FilamentContext';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'createdAt_desc', label: 'Newest first' },
  { value: 'price_desc', label: 'Price (high → low)' },
  { value: 'brand_asc', label: 'Brand (A → Z)' },
  { value: 'brand_desc', label: 'Brand (Z → A)' },
];

export function SortBar() {
  const { sort, setSort } = useFilament();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Sort:</span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
