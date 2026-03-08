import type { Filament, FilterState, SortOption, Brand } from '../types';

export function applyFilters(filaments: Filament[], filter: FilterState): Filament[] {
  return filaments.filter((f) => {
    if (filter.brandId && f.brandId !== filter.brandId) return false;
    if (filter.materialId && f.materialId !== filter.materialId) return false;
    return true;
  });
}

export function applySort(filaments: Filament[], sort: SortOption, brands: Brand[]): Filament[] {
  const copy = [...filaments];
  switch (sort) {
    case 'createdAt_desc':
      return copy.sort((a, b) => b.createdAt - a.createdAt);
    case 'price_desc':
      return copy.sort((a, b) => b.priceUsd - a.priceUsd);
    case 'brand_asc':
      return copy.sort((a, b) => {
        const nameA = brands.find((br) => br.id === a.brandId)?.name ?? '';
        const nameB = brands.find((br) => br.id === b.brandId)?.name ?? '';
        return nameA.localeCompare(nameB);
      });
    case 'brand_desc':
      return copy.sort((a, b) => {
        const nameA = brands.find((br) => br.id === a.brandId)?.name ?? '';
        const nameB = brands.find((br) => br.id === b.brandId)?.name ?? '';
        return nameB.localeCompare(nameA);
      });
  }
}
