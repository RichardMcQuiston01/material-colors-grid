import { normalizeDocument } from './normalize';
import type { ProjectDocument } from './types';

export type ImportResult =
  { ok: true; document: ProjectDocument } | { ok: false; error: string };

/** Serializes a document to pretty-printed JSON for download. */
export function documentToJson(doc: ProjectDocument): string {
  return JSON.stringify(doc, null, 2);
}

/**
 * Parses user-supplied JSON into a document. Unlike the localStorage loader,
 * this reports an error instead of silently falling back to defaults, so the
 * UI can tell the user their file was not imported.
 */
export function parseImportedDocument(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }

  if (!isDocumentLike(parsed)) {
    return {
      ok: false,
      error: 'File is not a Material Colors Grid document.',
    };
  }

  return { ok: true, document: normalizeDocument(parsed) };
}

function isDocumentLike(value: unknown): value is ProjectDocument {
  if (typeof value !== 'object' || value === null) return false;
  const doc = value as Record<string, unknown>;
  return (
    Array.isArray(doc.categories) &&
    typeof doc.style === 'object' &&
    doc.style !== null
  );
}
