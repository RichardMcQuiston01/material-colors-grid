import { describe, expect, test } from 'vitest';
import { createDefaultDocument } from './defaults';
import { deserializeDocument, serializeDocument } from './persistence';

describe('document persistence', () => {
  test('round-trips a document through serialize/deserialize', () => {
    const doc = createDefaultDocument();
    doc.categories[0].name = 'PLA';
    doc.style.cardsPerRow = 4;

    const restored = deserializeDocument(serializeDocument(doc));

    expect(restored).toEqual(doc);
  });

  test('falls back to defaults when storage is empty (null)', () => {
    expect(deserializeDocument(null)).toEqual(createDefaultDocument());
  });

  test('falls back to defaults on invalid JSON', () => {
    expect(deserializeDocument('}{not json')).toEqual(createDefaultDocument());
  });

  test('falls back to defaults when the shape is wrong', () => {
    expect(deserializeDocument('{"foo":true}')).toEqual(
      createDefaultDocument(),
    );
  });
});
