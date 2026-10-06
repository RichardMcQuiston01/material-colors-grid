import type { Category, ProjectDocument, StyleConfig } from './types';

/** Generates a unique id for categories, sub-categories, and colors. */
export function createId(): string {
  return crypto.randomUUID();
}

/** Stable id for the seed "Default" category, so a fresh document is reproducible. */
export const DEFAULT_CATEGORY_ID = 'default';

function createDefaultCategory(): Category {
  return {
    id: DEFAULT_CATEGORY_ID,
    name: 'Default',
    colors: [],
    subCategories: [],
  };
}

function createDefaultStyle(): StyleConfig {
  return {
    orientation: 'landscape',
    aspectRatio: '4:3',
    width: 1440,
    height: 1280,
    cardsPerRow: 5,
    cardBackground: '#f7f7f7',
    border: {
      rounded: true,
      thickness: '0.25rem',
      color: '#dddddd',
    },
    fonts: {
      category: { family: 'Arial', color: '#000000', size: '1rem' },
      subCategory: { family: 'Arial', color: '#000000', size: '0.85rem' },
      card: { family: 'Arial', color: 'auto', size: '0.75rem' },
    },
    // Bands are off by default (empty text); colors apply once text is added.
    header: {
      text: '',
      background: '#1b5e20',
      font: { family: 'Arial', color: '#ffffff', size: '1.5rem' },
    },
    footer: {
      text: '',
      background: '#1b5e20',
      font: { family: 'Arial', color: '#ffffff', size: '0.85rem' },
    },
    watermark: {
      dataUrl: null,
      position: 'bottom-right',
      scale: 0.15,
      opacity: 1,
    },
  };
}

/** Builds a fresh, independent document with the README default settings. */
export function createDefaultDocument(): ProjectDocument {
  return {
    categories: [createDefaultCategory()],
    style: createDefaultStyle(),
  };
}
