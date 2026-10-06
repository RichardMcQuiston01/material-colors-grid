import { drawDocument } from './renderer';
import { DEFAULT_METRICS, type LayoutMetrics } from './layout';
import type { ProjectDocument } from './types';

/** Options accepted by {@link renderToCanvas}. */
export interface RenderOptions {
  /** Layout spacing overrides; defaults to {@link DEFAULT_METRICS}. */
  metrics?: LayoutMetrics;
  /** Already-loaded watermark image, drawn when the document enables one. */
  watermarkImage?: HTMLImageElement | null;
}

export type RenderResult = { ok: true } | { ok: false; error: string };

export type BlobResult =
  { ok: true; blob: Blob } | { ok: false; error: string };

export type DataUrlResult =
  { ok: true; dataUrl: string } | { ok: false; error: string };

/**
 * Renders a document onto a canvas element, resizing it to the document's
 * configured output dimensions. Returns an error result (rather than throwing)
 * when a 2D context is unavailable or drawing fails.
 */
export function renderToCanvas(
  canvas: HTMLCanvasElement,
  doc: ProjectDocument,
  options: RenderOptions = {},
): RenderResult {
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return {
      ok: false,
      error:
        'Could not obtain a 2D rendering context from the canvas; the canvas may already be using a different context type.',
    };
  }

  try {
    drawDocument(
      ctx,
      doc,
      options.metrics ?? DEFAULT_METRICS,
      options.watermarkImage,
    );
  } catch (error) {
    return {
      ok: false,
      error: `Failed to draw the color grid: ${describeError(error)}`,
    };
  }
  return { ok: true };
}

/** Encodes a rendered canvas as an image Blob (PNG by default). */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality?: number,
): Promise<BlobResult> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob(
        (blob) =>
          resolve(
            blob === null
              ? {
                  ok: false,
                  error: `The canvas could not be encoded as ${type}; it may be empty, tainted by a cross-origin image, or the type is unsupported.`,
                }
              : { ok: true, blob },
          ),
        type,
        quality,
      );
    } catch (error) {
      resolve({
        ok: false,
        error: `Failed to encode the canvas as ${type}: ${describeError(error)}`,
      });
    }
  });
}

/** Encodes a rendered canvas as a data URL (PNG by default). */
export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality?: number,
): DataUrlResult {
  try {
    return { ok: true, dataUrl: canvas.toDataURL(type, quality) };
  } catch (error) {
    return {
      ok: false,
      error: `Failed to encode the canvas as ${type}: ${describeError(error)}`,
    };
  }
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
