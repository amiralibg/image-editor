export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  backgroundColor: string;
}

export interface PresetFilter {
  name: string;
  filter: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}