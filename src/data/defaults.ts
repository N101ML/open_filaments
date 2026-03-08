import type { Brand, Material, FilamentColor, AppData } from "../types";

export const defaultBrands: Brand[] = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Bambu Lab" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Polymaker" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Hatchbox" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Prusament" },
  { id: "55555555-5555-5555-5555-555555555555", name: "eSUN" },
];

export const defaultMaterials: Material[] = [
  { id: "aaaa0001-0000-0000-0000-000000000001", name: "PLA" },
  { id: "aaaa0002-0000-0000-0000-000000000002", name: "PETG" },
  { id: "aaaa0003-0000-0000-0000-000000000003", name: "ABS" },
  { id: "aaaa0004-0000-0000-0000-000000000004", name: "TPU" },
  { id: "aaaa0005-0000-0000-0000-000000000005", name: "ASA" },
  { id: "aaaa0006-0000-0000-0000-000000000006", name: "Nylon" },
];

export const defaultColors: FilamentColor[] = [
  { id: "cccc0001-0000-0000-0000-000000000001", name: "Black", hex: "#1a1a1a" },
  { id: "cccc0002-0000-0000-0000-000000000002", name: "White", hex: "#f5f5f5" },
  { id: "cccc0003-0000-0000-0000-000000000003", name: "Red", hex: "#e53e3e" },
  { id: "cccc0004-0000-0000-0000-000000000004", name: "Blue", hex: "#3182ce" },
  { id: "cccc0005-0000-0000-0000-000000000005", name: "Green", hex: "#38a169" },
  {
    id: "cccc0006-0000-0000-0000-000000000006",
    name: "Yellow",
    hex: "#d69e2e",
  },
  {
    id: "cccc0007-0000-0000-0000-000000000007",
    name: "Orange",
    hex: "#dd6b20",
  },
  {
    id: "cccc0008-0000-0000-0000-000000000008",
    name: "Purple",
    hex: "#805ad5",
  },
];

export const defaultAppData: AppData = {
  filaments: [],
  brands: defaultBrands,
  materials: defaultMaterials,
  colors: defaultColors,
};
