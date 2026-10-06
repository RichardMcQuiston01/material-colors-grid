import { cssSizeToPx } from './units';
import type { BandConfig, Color, RenderSection, StyleConfig } from './types';

export interface CardBox {
  type: 'card';
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
}

export interface HeaderBox {
  type: 'header';
  level: 'category' | 'subCategory';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export type LayoutItem = CardBox | HeaderBox;

export interface Layout {
  width: number;
  height: number;
  items: LayoutItem[];
}

/** Spacing/sizing in canvas pixels. Tunable; defaults chosen for legibility. */
export interface LayoutMetrics {
  padding: number;
  gap: number;
  cardHeight: number;
  categoryHeaderHeight: number;
  subCategoryHeaderHeight: number;
}

export const DEFAULT_METRICS: LayoutMetrics = {
  padding: 32,
  gap: 16,
  cardHeight: 120,
  categoryHeaderHeight: 48,
  subCategoryHeaderHeight: 32,
};

/**
 * Pixel height reserved for a header/footer band, or 0 when the band has no
 * text (and is therefore not drawn).
 */
export function bandHeight(band: BandConfig, metrics: LayoutMetrics): number {
  if (!band.text.trim()) return 0;
  return cssSizeToPx(band.font.size) + metrics.padding * 1.5;
}

/**
 * Computes absolute positions for every header and card. Cards flow left to
 * right, wrapping after `style.cardsPerRow`; each section begins on a new row,
 * and a category header is emitted only when the category changes. Content is
 * shifted down to clear a header band when one is present.
 *
 * The returned `height` is at least `style.height`, but grows to fit when the
 * content plus the footer band would otherwise overflow — so cards are never
 * clipped by the fixed canvas height and the footer never draws over them.
 */
export function computeLayout(
  sections: RenderSection[],
  style: StyleConfig,
  metrics: LayoutMetrics = DEFAULT_METRICS,
): Layout {
  const { padding, gap, cardHeight } = metrics;
  const contentWidth = style.width - padding * 2;
  // cardsPerRow must be a positive integer: a fractional value would place
  // cards at fractional columns and compute wrong row breaks.
  const cardsPerRow = Number.isFinite(style.cardsPerRow)
    ? Math.max(1, Math.floor(style.cardsPerRow))
    : 1;
  const cardWidth = (contentWidth - gap * (cardsPerRow - 1)) / cardsPerRow;

  const items: LayoutItem[] = [];
  let y = padding + bandHeight(style.header, metrics);
  let previousCategory: string | null = null;

  for (const section of sections) {
    if (
      section.categoryHeader !== null &&
      section.categoryHeader !== previousCategory
    ) {
      items.push({
        type: 'header',
        level: 'category',
        x: padding,
        y,
        width: contentWidth,
        height: metrics.categoryHeaderHeight,
        text: section.categoryHeader,
      });
      y += metrics.categoryHeaderHeight + gap;
    }
    previousCategory = section.categoryHeader;

    if (section.subCategoryHeader !== null) {
      items.push({
        type: 'header',
        level: 'subCategory',
        x: padding,
        y,
        width: contentWidth,
        height: metrics.subCategoryHeaderHeight,
        text: section.subCategoryHeader,
      });
      y += metrics.subCategoryHeaderHeight + gap;
    }

    section.colors.forEach((color, i) => {
      const col = i % cardsPerRow;
      const row = Math.floor(i / cardsPerRow);
      items.push({
        type: 'card',
        x: padding + col * (cardWidth + gap),
        y: y + row * (cardHeight + gap),
        width: cardWidth,
        height: cardHeight,
        color,
      });
    });

    const rows = Math.ceil(section.colors.length / cardsPerRow);
    y += rows * (cardHeight + gap);
  }

  // Reserve the footer band plus bottom padding, and expand the canvas when the
  // content would otherwise overflow the configured height.
  const requiredHeight = y + bandHeight(style.footer, metrics) + padding;
  const height = Math.max(style.height, requiredHeight);

  return { width: style.width, height, items };
}
