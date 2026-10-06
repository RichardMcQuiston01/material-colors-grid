import { describe, expect, it } from 'vitest';
import * as api from '../src/index';

describe('public API', () => {
  it('exports the documented runtime surface', () => {
    expect(Object.keys(api).sort()).toEqual(
      [
        'DEFAULT_CATEGORY_ID',
        'DEFAULT_METRICS',
        'MIN_CARD_TEXT_CONTRAST',
        'STORAGE_KEY',
        'bandHeight',
        'buildRenderModel',
        'canvasToBlob',
        'canvasToDataUrl',
        'computeLayout',
        'contrastRatio',
        'createCategory',
        'createColor',
        'createDefaultDocument',
        'createId',
        'createSubCategory',
        'cssSizeToPx',
        'deserializeDocument',
        'documentToJson',
        'drawDocument',
        'hexToRgb',
        'isCategory',
        'isColor',
        'isHexColor',
        'isProjectDocument',
        'isSubCategory',
        'luminance',
        'normalizeDocument',
        'parseImportedDocument',
        'readableTextColor',
        'relativeLuminance',
        'renderToCanvas',
        'resolveAutoTextColor',
        'serializeDocument',
        'sortColorsDarkToLight',
        'watermarkRect',
      ].sort(),
    );
  });

  it('round-trips a document through JSON export and import', () => {
    const doc = api.createDefaultDocument();
    const category = api.createCategory('PETG');
    category.colors.push(api.createColor('Teal', '#008080'));
    doc.categories = [category];

    const result = api.parseImportedDocument(api.documentToJson(doc));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.document).toEqual(doc);
  });
});
