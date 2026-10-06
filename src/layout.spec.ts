import { describe, expect, test } from 'vitest';
import { computeLayout, bandHeight, DEFAULT_METRICS } from './layout';
import type { Color, RenderSection } from './types';
import { createDefaultDocument } from './defaults';

const color = (name: string, hex: string): Color => ({ id: name, name, hex });

const section = (
  categoryHeader: string | null,
  subCategoryHeader: string | null,
  colors: Color[],
): RenderSection => ({ categoryHeader, subCategoryHeader, colors });

const style = () => createDefaultDocument().style;

describe('computeLayout', () => {
  test('emits exactly one card per color', () => {
    const sections = [
      section(null, null, [color('A', '#000000'), color('B', '#ffffff')]),
    ];

    const cards = computeLayout(sections, style()).items.filter(
      (i) => i.type === 'card',
    );

    expect(cards).toHaveLength(2);
  });

  test('wraps to a new row after cardsPerRow cards', () => {
    const s = { ...style(), cardsPerRow: 2 };
    const sections = [
      section(null, null, [
        color('A', '#000000'),
        color('B', '#333333'),
        color('C', '#ffffff'),
      ]),
    ];

    const cards = computeLayout(sections, s).items.filter(
      (i) => i.type === 'card',
    );

    // Third card starts a new row: same x as the first, larger y.
    expect(cards[2].x).toBe(cards[0].x);
    expect(cards[2].y).toBeGreaterThan(cards[0].y);
    // Second card sits to the right of the first on the same row.
    expect(cards[1].x).toBeGreaterThan(cards[0].x);
    expect(cards[1].y).toBe(cards[0].y);
  });

  test('emits a category header once across consecutive sections of that category', () => {
    const sections = [
      section('PLA', null, [color('A', '#000000')]),
      section('PLA', 'Matte', [color('B', '#ffffff')]),
    ];

    const headers = computeLayout(sections, style()).items.filter(
      (i) => i.type === 'header',
    );

    const categoryHeaders = headers.filter((h) => h.level === 'category');
    const subHeaders = headers.filter((h) => h.level === 'subCategory');
    expect(categoryHeaders).toHaveLength(1);
    expect(categoryHeaders[0].text).toBe('PLA');
    expect(subHeaders).toHaveLength(1);
    expect(subHeaders[0].text).toBe('Matte');
  });

  test('shifts cards down to make room for a header band', () => {
    const sections = [section(null, null, [color('A', '#000000')])];

    const baseCard = computeLayout(sections, style()).items.find(
      (i) => i.type === 'card',
    );
    const withBand = computeLayout(sections, {
      ...style(),
      header: { ...style().header, text: 'My Colors' },
    }).items.find((i) => i.type === 'card');

    expect(baseCard?.type).toBe('card');
    expect(withBand?.type).toBe('card');
    if (baseCard?.type === 'card' && withBand?.type === 'card') {
      expect(withBand.y).toBeGreaterThan(baseCard.y);
    }
  });

  test('emits no header items when headers are null', () => {
    const sections = [section(null, null, [color('A', '#000000')])];

    const headers = computeLayout(sections, style()).items.filter(
      (i) => i.type === 'header',
    );

    expect(headers).toHaveLength(0);
  });

  test('normalizes a fractional cardsPerRow to a positive integer', () => {
    const s = { ...style(), cardsPerRow: 2.9 };
    const sections = [
      section(null, null, [
        color('A', '#000000'),
        color('B', '#333333'),
        color('C', '#ffffff'),
      ]),
    ];

    const cards = computeLayout(sections, s).items.filter(
      (i) => i.type === 'card',
    );

    // 2.9 floors to 2 per row: the third card wraps under the first.
    expect(cards[2].x).toBe(cards[0].x);
    expect(cards[2].y).toBeGreaterThan(cards[0].y);
    expect(cards[1].y).toBe(cards[0].y);
  });

  test('expands height to fit content that overflows style.height', () => {
    const many = Array.from({ length: 40 }, (_, i) =>
      color(`C${i}`, '#000000'),
    );
    const s = { ...style(), height: 300, cardsPerRow: 1 };

    const layout = computeLayout([section(null, null, many)], s);
    const lastCard = layout.items.filter((i) => i.type === 'card').at(-1);

    expect(layout.height).toBeGreaterThan(300);
    expect(lastCard?.type).toBe('card');
    if (lastCard?.type === 'card') {
      expect(lastCard.y + lastCard.height).toBeLessThanOrEqual(layout.height);
    }
  });

  test('reserves footer space below the last card', () => {
    const s = {
      ...style(),
      height: 200,
      cardsPerRow: 1,
      footer: { ...style().footer, text: 'makertemplate.pro' },
    };
    const cards = [color('A', '#000000'), color('B', '#ffffff')];

    const layout = computeLayout([section(null, null, cards)], s);
    const lastCard = layout.items.filter((i) => i.type === 'card').at(-1);
    const footerTop = layout.height - bandHeight(s.footer, DEFAULT_METRICS);

    if (lastCard?.type === 'card') {
      expect(footerTop).toBeGreaterThanOrEqual(lastCard.y + lastCard.height);
    }
  });
});
