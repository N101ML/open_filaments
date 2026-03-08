import { FilamentProvider, useFilament } from './context/FilamentContext';
import { Header } from './components/layout/Header';
import { FilterBar } from './components/controls/FilterBar';
import { SortBar } from './components/controls/SortBar';
import { FilamentList } from './components/filament/FilamentList';
import { FilamentForm } from './components/filament/FilamentForm';
import { DeleteConfirm } from './components/filament/DeleteConfirm';
import { Modal } from './components/shared/Modal';

function AppContent() {
  const { modal, setModal } = useFilament();

  const closeModal = () => setModal({ type: 'closed' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3">
          <FilterBar />
          <SortBar />
        </div>
        <FilamentList />
      </main>

      {/* Add modal */}
      <Modal isOpen={modal.type === 'add'} onClose={closeModal} title="Add Filament">
        <FilamentForm onClose={closeModal} />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        title="Edit Filament"
      >
        {modal.type === 'edit' && (
          <FilamentForm initial={modal.filament} onClose={closeModal} />
        )}
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={modal.type === 'delete'}
        onClose={closeModal}
        title="Delete Filament"
        maxWidth="max-w-sm"
      >
        {modal.type === 'delete' && (
          <DeleteConfirm filament={modal.filament} onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <FilamentProvider>
      <AppContent />
    </FilamentProvider>
  );
}
