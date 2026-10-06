import { describe, expect, test } from 'vitest';
import { createCategory, createColor, createSubCategory } from './factories';

describe('entity factories', () => {
  test('createColor sets fields and a unique id', () => {
    const a = createColor('Red', '#ff0000');
    const b = createColor('Red', '#ff0000');

    expect(a.name).toBe('Red');
    expect(a.hex).toBe('#ff0000');
    expect(a.id).not.toBe(b.id);
  });

  test('createCategory starts empty', () => {
    const c = createCategory('PLA');

    expect(c.name).toBe('PLA');
    expect(c.colors).toEqual([]);
    expect(c.subCategories).toEqual([]);
    expect(c.id).toBeTruthy();
  });

  test('createSubCategory starts with no colors', () => {
    const s = createSubCategory('Matte');

    expect(s.name).toBe('Matte');
    expect(s.colors).toEqual([]);
    expect(s.id).toBeTruthy();
  });
});
