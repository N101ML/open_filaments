export interface Brand {
  id: string;
  name: string;
}

export interface Material {
  id: string;
  name: string;
}

export interface FilamentColor {
  id: string;
  name: string;
  hex: string; // always 7-char lowercase #rrggbb
}

export interface Filament {
  id: string;
  brandId: string;
  materialId: string;
  colorId: string;
  weightKg: number;
  priceUsd: number;
  createdAt: number;
}

export interface AppData {
  filaments: Filament[];
  brands: Brand[];
  materials: Material[];
  colors: FilamentColor[];
}

export type ModalMode =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; filament: Filament }
  | { type: 'delete'; filament: Filament };

export type SortOption = 'createdAt_desc' | 'price_desc' | 'brand_asc' | 'brand_desc';

export interface FilterState {
  brandId: string;
  materialId: string;
}

export interface FormErrors {
  brandId?: string;
  materialId?: string;
  colorId?: string;
  weightKg?: string;
  priceUsd?: string;
}

export type AppAction =
  | { type: 'ADD_FILAMENT'; payload: Filament }
  | { type: 'UPDATE_FILAMENT'; payload: Filament }
  | { type: 'DELETE_FILAMENT'; payload: string }
  | { type: 'ADD_BRAND'; payload: { name: string } }
  | { type: 'ADD_MATERIAL'; payload: { name: string } }
  | { type: 'ADD_COLOR'; payload: FilamentColor }
  | { type: 'UPDATE_BRAND'; payload: { id: string; name: string } }
  | { type: 'UPDATE_MATERIAL'; payload: { id: string; name: string } };
