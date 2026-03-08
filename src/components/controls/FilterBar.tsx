import { useFilament } from '../../context/FilamentContext';

export function FilterBar() {
  const { state, filter, setFilter } = useFilament();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-gray-600">Filter:</span>
      <select
        value={filter.brandId}
        onChange={(e) => setFilter({ ...filter, brandId: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Brands</option>
        {state.brands.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <select
        value={filter.materialId}
        onChange={(e) => setFilter({ ...filter, materialId: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Materials</option>
        {state.materials.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      {(filter.brandId || filter.materialId) && (
        <button
          onClick={() => setFilter({ brandId: '', materialId: '' })}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
