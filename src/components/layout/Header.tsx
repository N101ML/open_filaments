import { useFilament } from '../../context/FilamentContext';
import { Button } from '../shared/Button';

export function Header() {
  const { state, setModal } = useFilament();
  const count = state.filaments.length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Filament Tracker</h1>
            <p className="text-xs text-gray-500">
              {count} spool{count !== 1 ? 's' : ''} in inventory
            </p>
          </div>
        </div>
        <Button onClick={() => setModal({ type: 'add' })}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Filament
        </Button>
      </div>
    </header>
  );
}
