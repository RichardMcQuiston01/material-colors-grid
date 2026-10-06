import { createDefaultDocument } from './defaults';
import { normalizeDocument } from './normalize';
import { isProjectDocument } from './validate';
import type { ProjectDocument } from './types';

/** localStorage key under which the document is persisted. */
export const STORAGE_KEY = 'material-colors-grid:document';

/** Serializes a document to compact JSON for localStorage. */
export function serializeDocument(doc: ProjectDocument): string {
  return JSON.stringify(doc);
}

/**
 * Parses a stored document, falling back to a fresh default document when the
 * input is missing, not valid JSON, or structurally unrecognizable. The
 * category tree is deeply validated, so stored data with a malformed entry
 * falls back to defaults rather than yielding an invalid document.
 */
export function deserializeDocument(raw: string | null): ProjectDocument {
  if (raw === null) return createDefaultDocument();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return createDefaultDocument();
  }

  if (!isProjectDocument(parsed)) return createDefaultDocument();
  return normalizeDocument(parsed);
}
