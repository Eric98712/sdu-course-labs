import katex from 'katex';

interface TextSegment {
  type: 'text' | 'inline_math' | 'block_math';
  content: string;
}

function parseMath(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remaining = text;
  const blockRegex = /\$\$([\s\S]*?)\$\$/;
  const inlineRegex = /\$([^\s$][^$]*?[^\s$])\$/;

  while (remaining.length > 0) {
    // try block math first
    const blockMatch = remaining.match(blockRegex);
    const inlineMatch = remaining.match(inlineRegex);

    let match: RegExpMatchArray | null = null;
    let type: 'block_math' | 'inline_math' | null = null;
    let index = -1;

    if (blockMatch && inlineMatch) {
      if (blockMatch.index! < inlineMatch.index!) {
        match = blockMatch;
        type = 'block_math';
        index = blockMatch.index!;
      } else {
        match = inlineMatch;
        type = 'inline_math';
        index = inlineMatch.index!;
      }
    } else if (blockMatch) {
      match = blockMatch;
      type = 'block_math';
      index = blockMatch.index!;
    } else if (inlineMatch) {
      match = inlineMatch;
      type = 'inline_math';
      index = inlineMatch.index!;
    }

    if (!match || type === null) {
      segments.push({ type: 'text', content: remaining });
      break;
    }

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
