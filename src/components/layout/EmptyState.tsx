import { useFilament } from '../../context/FilamentContext';
import { Button } from '../shared/Button';

export function EmptyState() {
  const { setModal, filter } = useFilament();
  const isFiltered = filter.brandId || filter.materialId;

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      {isFiltered ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No filaments match your filters</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting the brand or material filter.</p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No filaments yet</h3>
          <p className="text-gray-500 text-sm mb-4">Start tracking your filament inventory.</p>
          <Button onClick={() => setModal({ type: 'add' })}>Add First Filament</Button>
        </>
      )}
    </div>
  );
}
