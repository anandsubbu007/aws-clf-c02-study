import { Fragment } from 'react';
import type { ReactNode } from 'react';

/**
 * Renders the tiny inline markup used in content strings:
 * **bold**, *italic* and `code`. Everything else is plain text (React escapes it).
 */
export function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) parts.push(<strong key={i++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('`')) parts.push(<code key={i++}>{tok.slice(1, -1)}</code>);
    else parts.push(<em key={i++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.map((p, idx) => <Fragment key={idx}>{p}</Fragment>);
}

/** Strips inline markup for search indexing and plain-text contexts. */
export function stripInline(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\*([^*\s][^*]*)\*/g, '$1');
}
