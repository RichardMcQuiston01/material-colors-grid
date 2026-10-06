import { describe, expect, test } from 'vitest';
import { createDefaultDocument } from './defaults';

describe('createDefaultDocument', () => {
  test('starts with a single empty "Default" category', () => {
    const doc = createDefaultDocument();

    expect(doc.categories).toHaveLength(1);
    expect(doc.categories[0].name).toBe('Default');
    expect(doc.categories[0].colors).toEqual([]);
    expect(doc.categories[0].subCategories).toEqual([]);
  });

  test('uses the README default style settings', () => {
    const { style } = createDefaultDocument();

    expect(style.orientation).toBe('landscape');
    expect(style.aspectRatio).toBe('4:3');
    expect(style.width).toBe(1440);
    expect(style.height).toBe(1280);
    expect(style.cardsPerRow).toBe(5);
    expect(style.cardBackground).toBe('#f7f7f7');
    expect(style.border).toEqual({
      rounded: true,
      thickness: '0.25rem',
      color: '#dddddd',
    });
  });

  test('uses the README default font settings', () => {
    const { fonts } = createDefaultDocument().style;

    expect(fonts.category).toEqual({
      family: 'Arial',
      color: '#000000',
      size: '1rem',
    });
    expect(fonts.subCategory).toEqual({
      family: 'Arial',
      color: '#000000',
      size: '0.85rem',
    });
    expect(fonts.card).toEqual({
      family: 'Arial',
      color: 'auto',
      size: '0.75rem',
    });
  });

  test('produces a fresh, independent document each call', () => {
    const a = createDefaultDocument();
    const b = createDefaultDocument();

    a.categories[0].name = 'Mutated';

    expect(b.categories[0].name).toBe('Default');
  });
});
