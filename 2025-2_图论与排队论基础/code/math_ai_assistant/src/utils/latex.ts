import katex from 'katex';

interface TextSegment {
  type: 'text' | 'inline_math' | 'block_math';
  content: string;
}

const MATH_PATTERNS: [RegExp, 'inline_math' | 'block_math'][] = [
  // Block: $$...$$, \[...\]
  [/\$\$([\s\S]*?)\$\$/, 'block_math'],
  [/\\\[([\s\S]*?)\\\]/, 'block_math'],
  // Inline: $...$, \(...\)
  [/\$([^$\n]+?)\$/, 'inline_math'],
  [/\\\(([^$\n]+?)\\\)/, 'inline_math'],
];

function parseMath(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Find the earliest match among all patterns
    let earliest: { index: number; match: RegExpMatchArray; type: 'inline_math' | 'block_math' } | null = null;

    for (const [regex, type] of MATH_PATTERNS) {
      const m = remaining.match(regex);
      if (m && m.index !== undefined) {
        if (!earliest || m.index < earliest.index) {
          earliest = { index: m.index, match: m, type };
        }
      }
    }

    if (!earliest) {
      segments.push({ type: 'text', content: remaining });
      break;
    }

    const { index, match, type } = earliest;

    // text before match
    if (index > 0) {
      segments.push({ type: 'text', content: remaining.slice(0, index) });
    }

    segments.push({ type, content: match[1].trim() });
    remaining = remaining.slice(index + match[0].length);
  }

  return segments;
}

export function renderLatex(text: string): string {
  const segments = parseMath(text);

  return segments
    .map((seg) => {
      switch (seg.type) {
        case 'text':
          return escapeHtml(seg.content);
        case 'inline_math':
          try {
            return katex.renderToString(seg.content, {
              throwOnError: false,
              displayMode: false,
              strict: false,
            });
          } catch {
            return `<span class="math-parse-error">\\(${escapeHtml(seg.content)}\\)</span>`;
          }
        case 'block_math':
          try {
            return katex.renderToString(seg.content, {
              throwOnError: false,
              displayMode: true,
              strict: false,
            });
          } catch {
            return `<div class="math-parse-error">\\[${escapeHtml(seg.content)}\\]</div>`;
          }
      }
    })
    .join('');
}

export function renderLatexSimple(text: string): {
  before: string;
  formula: string;
  after: string;
} | null {
  const blockMatch = text.match(/^\$\$([\s\S]*)\$\$$/);
  if (blockMatch) {
    try {
      const html = katex.renderToString(blockMatch[1].trim(), {
        throwOnError: false,
        displayMode: true,
      });
      return { before: '', formula: html, after: '' };
    } catch {
      return null;
    }
  }
  return null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
