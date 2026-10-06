/** A single color swatch: a display name plus its hex value (e.g. '#1b5e20'). */
export interface Color {
  id: string;
  name: string;
  hex: string;
}

/** An optional grouping of colors within a category. */
export interface SubCategory {
  id: string;
  name: string;
  colors: Color[];
}

/** A top-level grouping of colors and/or sub-categories. */
export interface Category {
  id: string;
  name: string;
  colors: Color[];
  subCategories: SubCategory[];
}

/**
 * A flattened, render-ready group produced from the category tree. Headers are
 * `null` when they should not be drawn (e.g. the sole "Default" category).
 */
export interface RenderSection {
  categoryHeader: string | null;
  subCategoryHeader: string | null;
  colors: Color[];
}

/** Font settings for a header level (category / sub-category). */
export interface FontConfig {
  family: string;
  /** Hex color for the text. */
  color: string;
  /** CSS size as authored, e.g. '1rem'. */
  size: string;
}

/**
 * Font settings for color cards. `color` may be the literal 'auto', which uses
 * each card's own hex value as its text color.
 */
export interface CardFontConfig {
  family: string;
  color: 'auto' | string;
  size: string;
}

export type Orientation = 'portrait' | 'landscape';

/**
 * A full-width text band drawn at the top (header) or bottom (footer) of the
 * canvas. An empty `text` means the band is not drawn.
 */
export interface BandConfig {
  text: string;
  background: string;
  font: FontConfig;
}

export type WatermarkPosition =
  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** An optional watermark image placed in a corner of the canvas. */
export interface WatermarkConfig {
  /** Data URL of the image, or null when no watermark is set. */
  dataUrl: string | null;
  position: WatermarkPosition;
  /** Width as a fraction of the canvas width (0–1). */
  scale: number;
  /** Opacity, 0–1. */
  opacity: number;
}

/** All output/appearance settings for the rendered canvas. */
export interface StyleConfig {
  orientation: Orientation;
  /** Aspect ratio label, e.g. '4:3'. */
  aspectRatio: string;
  width: number;
  height: number;
  cardsPerRow: number;
  cardBackground: string;
  border: {
    rounded: boolean;
    thickness: string;
    color: string;
  };
  fonts: {
    category: FontConfig;
    subCategory: FontConfig;
    card: CardFontConfig;
  };
  header: BandConfig;
  footer: BandConfig;
  watermark: WatermarkConfig;
}

/** The complete persisted document: the color tree plus style settings. */
export interface ProjectDocument {
  categories: Category[];
  style: StyleConfig;
}
