import { describe, expect, test } from 'vitest';
import { documentToJson, parseImportedDocument } from './import-export';
import { createDefaultDocument } from './defaults';

describe('import/export', () => {
  test('exported JSON re-imports to an equal document', () => {
    const doc = createDefaultDocument();

    const result = parseImportedDocument(documentToJson(doc));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.document).toEqual(doc);
  });

  test('normalizes an imported partial document', () => {
    const partial = JSON.stringify({ categories: [], style: {} });

    const result = parseImportedDocument(partial);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.document.style.cardsPerRow).toBe(
        createDefaultDocument().style.cardsPerRow,
      );
    }
  });

  test('rejects invalid JSON with an error message', () => {
    const result = parseImportedDocument('not json');

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeTruthy();
  });

  test('rejects JSON that is not a document', () => {
    const result = parseImportedDocument('{"foo":1}');

    expect(result.ok).toBe(false);
  });
});
