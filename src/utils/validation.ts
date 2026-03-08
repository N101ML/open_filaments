import type { FormErrors } from '../types';

interface FilamentFormData {
  brandId: string;
  materialId: string;
  colorId: string;
  weightKg: number | string;
  priceUsd: number | string;
}

export function validateFilamentForm(data: FilamentFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.brandId) errors.brandId = 'Brand is required.';
  if (!data.materialId) errors.materialId = 'Material is required.';
  if (!data.colorId) errors.colorId = 'Color is required.';

  const weight = Number(data.weightKg);
  if (!data.weightKg && data.weightKg !== 0) {
    errors.weightKg = 'Weight is required.';
  } else if (isNaN(weight) || weight <= 0) {
    errors.weightKg = 'Weight must be a positive number.';
  }

  const price = Number(data.priceUsd);
  if (data.priceUsd === '' || data.priceUsd === undefined) {
    errors.priceUsd = 'Price is required.';
  } else if (isNaN(price) || price < 0) {
    errors.priceUsd = 'Price must be a non-negative number.';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
