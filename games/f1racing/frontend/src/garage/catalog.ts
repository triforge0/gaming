import type { GarageLoadout } from '../shared';

export interface CarPreset {
  id: string;
  name: string;
  tagline: string;
  defaultColor: string;
}

export interface CosmeticOption {
  id: string;
  label: string;
}

export const CAR_PRESETS: CarPreset[] = [
  {
    id: 'formula-classic',
    name: 'Formula Classic',
    tagline: 'Vintage wings · same lap time',
    defaultColor: '#004225',
  },
  {
    id: 'formula-modern',
    name: 'Formula Modern',
    tagline: 'Current grid look · cosmetic only',
    defaultColor: '#e10600',
  },
  {
    id: 'formula-ev',
    name: 'Formula EV',
    tagline: 'Electric livery · identical physics',
    defaultColor: '#00d2be',
  },
  {
    id: 'formula-prototype',
    name: 'Formula Prototype',
    tagline: 'Concept body · no performance edge',
    defaultColor: '#ff8700',
  },
];

export const LIVERY_OPTIONS: CosmeticOption[] = [
  { id: 'solid', label: 'Solid' },
  { id: 'stripe', label: 'Center stripe' },
  { id: 'gradient', label: 'Gradient fade' },
  { id: 'carbon', label: 'Carbon accent' },
];

export const WHEEL_OPTIONS: CosmeticOption[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'gold', label: 'Gold rim' },
  { id: 'matte', label: 'Matte black' },
  { id: 'chrome', label: 'Chrome' },
];

export const NITRO_FX_OPTIONS: CosmeticOption[] = [
  { id: 'blue', label: 'Blue flame' },
  { id: 'orange', label: 'Orange burst' },
  { id: 'purple', label: 'Purple trail' },
  { id: 'white', label: 'White flash' },
];

const CAR_IDS = new Set(CAR_PRESETS.map((preset) => preset.id));

export function resolveCarPreset(carId: string): CarPreset {
  return CAR_PRESETS.find((preset) => preset.id === carId) ?? CAR_PRESETS[1];
}

export function normalizeGarageLoadout(raw: Partial<GarageLoadout> | null | undefined): GarageLoadout {
  const preset = resolveCarPreset(raw?.carId ?? CAR_PRESETS[1].id);
  const primaryColor = raw?.primaryColor?.trim() || preset.defaultColor;
  return {
    carId: CAR_IDS.has(raw?.carId ?? '') ? raw!.carId! : preset.id,
    primaryColor: primaryColor.startsWith('#') ? primaryColor : preset.defaultColor,
    liveryId: LIVERY_OPTIONS.some((option) => option.id === raw?.liveryId)
      ? raw!.liveryId
      : LIVERY_OPTIONS[0].id,
    wheelId: WHEEL_OPTIONS.some((option) => option.id === raw?.wheelId)
      ? raw!.wheelId
      : WHEEL_OPTIONS[0].id,
    nitroFxId: NITRO_FX_OPTIONS.some((option) => option.id === raw?.nitroFxId)
      ? raw!.nitroFxId
      : NITRO_FX_OPTIONS[0].id,
  };
}

export function formatCarLabel(carId: string): string {
  return resolveCarPreset(carId).name;
}
