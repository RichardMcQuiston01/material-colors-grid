import { describe, expect, test } from 'vitest';
import { normalizeDocument } from './normalize';
import { createDefaultDocument } from './defaults';
import type { ProjectDocument } from './types';

describe('normalizeDocument', () => {
  test('leaves a complete document unchanged', () => {
    const doc = createDefaultDocument();
    expect(normalizeDocument(doc)).toEqual(doc);
  });

  test('fills missing style sub-objects from defaults', () => {
    // A document shaped like an older version: style without `border`.
    const partial = {
      categories: [],
      style: { cardsPerRow: 3 },
    } as unknown as ProjectDocument;

    const normalized = normalizeDocument(partial);
    const defaults = createDefaultDocument().style;

    expect(normalized.style.border).toEqual(defaults.border);
    expect(normalized.style.fonts.card).toEqual(defaults.fonts.card);
    // Authored values are preserved.
    expect(normalized.style.cardsPerRow).toBe(3);
  });

  test('deep-merges partial font config', () => {
    const partial = {
      categories: [],
      style: { fonts: { category: { family: 'Georgia' } } },
    } as unknown as ProjectDocument;

    const normalized = normalizeDocument(partial);
    const defaults = createDefaultDocument().style;

    expect(normalized.style.fonts.category.family).toBe('Georgia');
    // Missing keys come from defaults.
    expect(normalized.style.fonts.category.size).toBe(
      defaults.fonts.category.size,
    );
  });
});
