import { describe, expect, it } from 'vitest';
import { createDefaultDocument } from './defaults';
import { createCategory, createColor } from './factories';
import { drawDocument } from './renderer';
import type { ProjectDocument } from './types';

interface Recorder {
  ctx: CanvasRenderingContext2D;
  texts: string[];
  fills: string[];
  canvas: { width: number; height: number };
}

function record(): Recorder {
  const texts: string[] = [];
  const fills: string[] = [];
  const canvas = { width: 0, height: 0 };
  const state: Record<string, unknown> = { canvas, globalAlpha: 1 };
  const ctx = {
    ...state,
    canvas,
    set fillStyle(value: string) {
      state.fillStyle = value;
    },
    get fillStyle(): string {
      return state.fillStyle as string;
    },
    globalAlpha: 1,
    fillRect: () => fills.push(state.fillStyle as string),
    fill: () => fills.push(state.fillStyle as string),
    fillText: (text: string) => texts.push(text),
    beginPath: () => undefined,
    rect: () => undefined,
    roundRect: () => undefined,
    stroke: () => undefined,
    drawImage: () => texts.push('<watermark>'),
  } as unknown as CanvasRenderingContext2D;
  return { ctx, texts, fills, canvas };
}

function documentWithColors(): ProjectDocument {
  const doc = createDefaultDocument();
  const pla = createCategory('PLA');
  pla.colors.push(
    createColor('White', '#ffffff'),
    createColor('Black', '#000000'),
  );
  doc.categories = [pla];
  return doc;
}

describe('drawDocument', () => {
  it('sizes the canvas to the configured dimensions', () => {
    const { ctx, canvas } = record();
    const doc = documentWithColors();

    drawDocument(ctx, doc);

    expect(canvas.width).toBe(doc.style.width);
    expect(canvas.height).toBe(doc.style.height);
  });

  it('draws category headers and cards dark to light', () => {
    const { ctx, texts } = record();

    drawDocument(ctx, documentWithColors());

    expect(texts).toContain('PLA');
    expect(texts.indexOf('Black')).toBeLessThan(texts.indexOf('White'));
    expect(texts).toContain('#000000');
  });

  it('omits band text when empty and draws it when set', () => {
    const doc = documentWithColors();
    const empty = record();
    drawDocument(empty.ctx, doc);
    expect(empty.texts).not.toContain('Order now');

    doc.style.footer.text = 'Order now';
    const withFooter = record();
    drawDocument(withFooter.ctx, doc);
    expect(withFooter.texts).toContain('Order now');
  });

  it('draws the watermark only when an image and data URL are present', () => {
    const doc = documentWithColors();
    const image = {
      naturalWidth: 100,
      naturalHeight: 50,
    } as HTMLImageElement;

    const noImage = record();
    doc.style.watermark.dataUrl = 'data:image/png;base64,AAAA';
    drawDocument(noImage.ctx, doc);
    expect(noImage.texts).not.toContain('<watermark>');

    const withImage = record();
    drawDocument(withImage.ctx, doc, undefined, image);
    expect(withImage.texts).toContain('<watermark>');

    const noUrl = record();
    doc.style.watermark.dataUrl = null;
    drawDocument(noUrl.ctx, doc, undefined, image);
    expect(noUrl.texts).not.toContain('<watermark>');
  });
});
