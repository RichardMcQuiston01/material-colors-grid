import { describe, expect, it, vi } from 'vitest';
import { canvasToBlob, canvasToDataUrl, renderToCanvas } from './canvas';
import { createDefaultDocument } from './defaults';
import { createColor } from './factories';

/** Records every call/assignment made to a fake 2D context. */
function createFakeContext(): {
  ctx: CanvasRenderingContext2D;
  calls: string[];
  canvas: { width: number; height: number };
} {
  const calls: string[] = [];
  const canvas = { width: 0, height: 0 };
  const target: Record<string | symbol, unknown> = { canvas };
  const ctx = new Proxy(target, {
    get(obj, prop) {
      if (prop in obj) return obj[prop];
      return (...args: unknown[]) => {
        calls.push(`${String(prop)}(${args.join(',')})`);
      };
    },
    set(obj, prop, value) {
      obj[prop] = value;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx, calls, canvas };
}

function createFakeCanvas(ctx: CanvasRenderingContext2D | null): {
  canvas: HTMLCanvasElement;
  getContext: ReturnType<typeof vi.fn>;
} {
  const getContext = vi.fn(() => ctx);
  return {
    canvas: { getContext } as unknown as HTMLCanvasElement,
    getContext,
  };
}

describe('renderToCanvas', () => {
  it('draws the document and sizes the canvas', () => {
    const { ctx, calls, canvas: sized } = createFakeContext();
    const { canvas, getContext } = createFakeCanvas(ctx);
    const doc = createDefaultDocument();
    doc.categories[0]!.colors.push(createColor('Forest', '#1b5e20'));

    const result = renderToCanvas(canvas, doc);

    expect(result).toEqual({ ok: true });
    expect(getContext).toHaveBeenCalledWith('2d');
    expect(sized.width).toBe(doc.style.width);
    expect(calls.some((call) => call.startsWith('fillText(Forest'))).toBe(true);
  });

  it('returns a descriptive error when no 2D context is available', () => {
    const { canvas } = createFakeCanvas(null);

    const result = renderToCanvas(canvas, createDefaultDocument());

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/2D rendering context/);
  });

  it('returns an error result instead of throwing when drawing fails', () => {
    const { ctx } = createFakeContext();
    Object.defineProperty(ctx, 'fillRect', {
      value: () => {
        throw new Error('boom');
      },
    });
    const { canvas } = createFakeCanvas(ctx);

    const result = renderToCanvas(canvas, createDefaultDocument());

    expect(result).toEqual({
      ok: false,
      error: 'Failed to draw the color grid: boom',
    });
  });
});

describe('canvasToBlob', () => {
  it('resolves with the encoded blob', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: BlobCallback) => cb(blob),
    } as unknown as HTMLCanvasElement;

    expect(await canvasToBlob(canvas)).toEqual({ ok: true, blob });
  });

  it('reports an error when encoding yields no blob', async () => {
    const canvas = {
      toBlob: (cb: BlobCallback) => cb(null),
    } as unknown as HTMLCanvasElement;

    const result = await canvasToBlob(canvas, 'image/webp');

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/image\/webp/);
  });

  it('reports an error when encoding throws', async () => {
    const canvas = {
      toBlob: () => {
        throw new Error('tainted');
      },
    } as unknown as HTMLCanvasElement;

    const result = await canvasToBlob(canvas);

    expect(result).toEqual({
      ok: false,
      error: 'Failed to encode the canvas as image/png: tainted',
    });
  });
});

describe('canvasToDataUrl', () => {
  it('returns the data URL', () => {
    const canvas = {
      toDataURL: (type: string) => `data:${type};base64,AAAA`,
    } as unknown as HTMLCanvasElement;

    expect(canvasToDataUrl(canvas)).toEqual({
      ok: true,
      dataUrl: 'data:image/png;base64,AAAA',
    });
  });

  it('reports an error when encoding throws', () => {
    const canvas = {
      toDataURL: () => {
        throw new Error('SecurityError');
      },
    } as unknown as HTMLCanvasElement;

    const result = canvasToDataUrl(canvas);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/SecurityError/);
  });
});
