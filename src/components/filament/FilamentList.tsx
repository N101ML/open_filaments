import { useFilament } from '../../context/FilamentContext';
import { FilamentCard } from './FilamentCard';
import { EmptyState } from '../layout/EmptyState';

export function FilamentList() {
  const { filteredFilaments } = useFilament();

  if (filteredFilaments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredFilaments.map((f) => (
        <FilamentCard key={f.id} filament={f} />
      ))}
    </div>
  );
}
