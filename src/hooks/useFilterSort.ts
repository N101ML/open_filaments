import { useMemo } from 'react';
import type { Filament, FilterState, SortOption, Brand } from '../types';
import { applyFilters } from '../utils/filterSort';
import { applySort } from '../utils/filterSort';

export function useFilterSort(
  filaments: Filament[],
  filter: FilterState,
  sort: SortOption,
  brands: Brand[]
): Filament[] {
  return useMemo(() => {
    const filtered = applyFilters(filaments, filter);
    return applySort(filtered, sort, brands);
  }, [filaments, filter, sort, brands]);
}
