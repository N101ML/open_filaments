import { createContext, useContext, useReducer, useEffect, useState, useMemo, type Dispatch } from 'react';
import type { ReactNode } from 'react';
import type {
  AppData,
  AppAction,
  Filament,
  ModalMode,
  FilterState,
  SortOption,
} from '../types';
import { defaultAppData } from '../data/defaults';
import { useFilterSort } from '../hooks/useFilterSort';

const STORAGE_KEY = 'filament-tracker-data';

function loadFromStorage(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // ignore
  }
  return defaultAppData;
}

function reducer(state: AppData, action: AppAction): AppData {
  switch (action.type) {
    case 'ADD_FILAMENT':
      return { ...state, filaments: [...state.filaments, action.payload] };

    case 'UPDATE_FILAMENT':
      return {
        ...state,
        filaments: state.filaments.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };

    case 'DELETE_FILAMENT':
      return {
        ...state,
        filaments: state.filaments.filter((f) => f.id !== action.payload),
      };

    case 'ADD_BRAND': {
      const nameLower = action.payload.name.toLowerCase();
      const exists = state.brands.some((b) => b.name.toLowerCase() === nameLower);
      if (exists) return state;
      return {
        ...state,
        brands: [...state.brands, { id: crypto.randomUUID(), name: action.payload.name }],
      };
    }

    case 'ADD_MATERIAL': {
      const nameLower = action.payload.name.toLowerCase();
      const exists = state.materials.some((m) => m.name.toLowerCase() === nameLower);
      if (exists) return state;
      return {
        ...state,
        materials: [...state.materials, { id: crypto.randomUUID(), name: action.payload.name }],
      };
    }

    case 'ADD_COLOR': {
      const exists = state.colors.some((c) => c.hex === action.payload.hex);
      if (exists) return state;
      return { ...state, colors: [...state.colors, action.payload] };
    }

    case 'UPDATE_BRAND':
      return {
        ...state,
        brands: state.brands.map((b) =>
          b.id === action.payload.id ? { ...b, name: action.payload.name } : b
        ),
      };

    case 'UPDATE_MATERIAL':
      return {
        ...state,
        materials: state.materials.map((m) =>
          m.id === action.payload.id ? { ...m, name: action.payload.name } : m
        ),
      };

    default:
      return state;
  }
}

interface FilamentContextValue {
  state: AppData;
  dispatch: Dispatch<AppAction>;
  filteredFilaments: Filament[];
  modal: ModalMode;
  setModal: (mode: ModalMode) => void;
  filter: FilterState;
  setFilter: (filter: FilterState) => void;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
}

const FilamentContext = createContext<FilamentContextValue | null>(null);

export function FilamentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage);
  const [modal, setModal] = useState<ModalMode>({ type: 'closed' });
  const [filter, setFilter] = useState<FilterState>({ brandId: '', materialId: '' });
  const [sort, setSort] = useState<SortOption>('createdAt_desc');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const filteredFilaments = useFilterSort(state.filaments, filter, sort, state.brands);

  const value = useMemo(
    () => ({ state, dispatch, filteredFilaments, modal, setModal, filter, setFilter, sort, setSort }),
    [state, filteredFilaments, modal, filter, sort]
  );

  return <FilamentContext.Provider value={value}>{children}</FilamentContext.Provider>;
}

export function useFilament(): FilamentContextValue {
  const ctx = useContext(FilamentContext);
  if (!ctx) throw new Error('useFilament must be used within FilamentProvider');
  return ctx;
}
