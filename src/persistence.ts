import { createDefaultDocument } from './defaults';
import { normalizeDocument } from './normalize';
import type { ProjectDocument } from './types';

/** localStorage key under which the document is persisted. */
export const STORAGE_KEY = 'material-colors-grid:document';

export function serializeDocument(doc: ProjectDocument): string {
  return JSON.stringify(doc);
}

/**
 * Parses a stored document, falling back to a fresh default document when the
 * input is missing, not valid JSON, or structurally unrecognizable.
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

function isProjectDocument(value: unknown): value is ProjectDocument {
  if (typeof value !== 'object' || value === null) return false;
  const doc = value as Record<string, unknown>;
  return (
    Array.isArray(doc.categories) &&
    typeof doc.style === 'object' &&
    doc.style !== null
  );
}
