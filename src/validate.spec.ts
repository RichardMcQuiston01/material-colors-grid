import { describe, expect, test } from 'vitest';
import {
  isCategory,
  isColor,
  isHexColor,
  isProjectDocument,
  isSubCategory,
} from './validate';
import { createDefaultDocument } from './defaults';

const validColor = { id: 'c1', name: 'Forest', hex: '#1b5e20' };

describe('isHexColor', () => {
  test.each(['#fff', '#FFFFFF', 'abc', '1b5e20'])('accepts %s', (value) => {
    expect(isHexColor(value)).toBe(true);
  });

  test.each([
    '#ffff',
    '#gggggg',
    '',
    'not-a-hex',
    '#12345',
    42,
    null,
    undefined,
  ])('rejects %s', (value) => {
    expect(isHexColor(value)).toBe(false);
  });
});

describe('isColor', () => {
  test('accepts a well-formed color', () => {
    expect(isColor(validColor)).toBe(true);
  });

  test('rejects missing fields, wrong types, and bad hex values', () => {
    expect(isColor({ ...validColor, id: 1 })).toBe(false);
    expect(isColor({ ...validColor, name: undefined })).toBe(false);
    expect(isColor({ ...validColor, hex: 'nope' })).toBe(false);
    expect(isColor(null)).toBe(false);
    expect(isColor('#fff')).toBe(false);
  });
});

describe('isSubCategory', () => {
  test('accepts a sub-category and rejects one with a bad color', () => {
    const base = { id: 's1', name: 'Matte', colors: [validColor] };

    expect(isSubCategory(base)).toBe(true);
    expect(
      isSubCategory({ ...base, colors: [{ ...validColor, hex: 'x' }] }),
    ).toBe(false);
    expect(isSubCategory({ ...base, colors: 'none' })).toBe(false);
  });
});

describe('isCategory', () => {
  const base = {
    id: 'p1',
    name: 'PLA',
    colors: [validColor],
    subCategories: [{ id: 's1', name: 'Matte', colors: [] }],
  };

  test('accepts a category with nested sub-categories', () => {
    expect(isCategory(base)).toBe(true);
  });

  test('rejects null, a malformed sub-category, and non-array fields', () => {
    expect(isCategory(null)).toBe(false);
    expect(isCategory({ ...base, subCategories: [null] })).toBe(false);
    expect(isCategory({ ...base, colors: undefined })).toBe(false);
    expect(isCategory({ ...base, subCategories: {} })).toBe(false);
  });
});

describe('isProjectDocument', () => {
  test('accepts the default document', () => {
    expect(isProjectDocument(createDefaultDocument())).toBe(true);
  });

  test('rejects non-objects and documents missing categories or style', () => {
    expect(isProjectDocument(null)).toBe(false);
    expect(isProjectDocument([])).toBe(false);
    expect(isProjectDocument({ categories: [] })).toBe(false);
    expect(isProjectDocument({ style: {} })).toBe(false);
  });

  test('rejects a document containing a malformed category', () => {
    expect(isProjectDocument({ categories: [null], style: {} })).toBe(false);
  });
});
