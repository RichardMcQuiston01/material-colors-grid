import { describe, expect, test } from 'vitest';
import { buildRenderModel } from './render-model';
import type { Category, Color } from './types';

const color = (name: string, hex: string): Color => ({ id: name, name, hex });

const category = (
  name: string,
  colors: Color[] = [],
  subCategories: Category['subCategories'] = [],
): Category => ({ id: name, name, colors, subCategories });

describe('buildRenderModel', () => {
  test('omits the category header when "Default" is the only category', () => {
    const sections = buildRenderModel([
      category('Default', [
        color('White', '#ffffff'),
        color('Black', '#000000'),
      ]),
    ]);

    expect(sections).toHaveLength(1);
    expect(sections[0].categoryHeader).toBeNull();
    expect(sections[0].colors.map((c) => c.name)).toEqual(['Black', 'White']);
  });

  test('orders categories alphabetically and keeps their headers', () => {
    const sections = buildRenderModel([
      category('PETG', [color('Blue', '#0000ff')]),
      category('PLA', [color('Red', '#ff0000')]),
    ]);

    expect(sections.map((s) => s.categoryHeader)).toEqual(['PETG', 'PLA']);
  });

  test('renders direct colors before alphabetically-ordered sub-categories', () => {
    const sections = buildRenderModel([
      category(
        'PLA',
        [color('Gray', '#808080')],
        [
          {
            id: 'Matte',
            name: 'Matte',
            colors: [color('Black', '#000000')],
          },
          {
            id: 'Basic',
            name: 'Basic',
            colors: [color('White', '#ffffff')],
          },
        ],
      ),
    ]);

    expect(
      sections.map((s) => [s.categoryHeader, s.subCategoryHeader]),
    ).toEqual([
      ['PLA', null],
      ['PLA', 'Basic'],
      ['PLA', 'Matte'],
    ]);
  });
});
