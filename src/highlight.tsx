import { Text } from 'ink';
import type { ReactNode } from 'react';
import { codeToTokens } from 'shiki';

const TERMINAL_COLORS: Record<string, string> = {
  // Comments
  comment: 'gray',
  'comment.block': 'gray',
  'comment.line': 'gray',

  // Keywords
  keyword: 'magenta',
  'keyword.control': 'magenta',
  'keyword.other': 'magenta',

  // Strings
  string: 'green',
  'string.quoted': 'green',
  'string.regexp': 'red',

  // Functions
  'entity.name.function': 'blue',
  'support.function': 'blueBright',
  'meta.function-call': 'blueBright',

  // Variables
  variable: 'white',
  'variable.parameter': 'yellowBright',
  'variable.other': 'white',

  // Types & Classes
  'entity.name.type': 'cyan',
  'entity.name.class': 'yellowBright',
  'support.type': 'cyanBright',
  'support.class': 'yellowBright',

  // Numbers
  'constant.numeric': 'yellow',
  'constant.language': 'yellow',

  // Operators & Punctuation
  operator: 'cyan',
  punctuation: 'white',

  // Properties & Attributes
  'variable.other.property': 'blue',
  'entity.other.attribute-name': 'blue',

  // Tags (HTML/XML)
  'entity.name.tag': 'red',
  'meta.tag': 'red',

  // Booleans & Null
  'constant.language.boolean': 'yellow',
  'constant.language.null': 'yellow',

  // Meta
  meta: 'gray',
  storage: 'magenta',
  'storage.type': 'magenta',
};

/**
 * Convert hex color to closest terminal color name
 * This is a simple approximation based on common Shiki theme colors
 */
function hexToTerminalColor(hex: string): string | undefined {
  const colorMap: Record<string, string> = {
    // Gray/Comments
    '#6a737d': 'gray',
    '#8b949e': 'gray',
    '#6e7681': 'gray',

    // Keywords/Purple/Magenta
    '#d73a49': 'magenta',
    '#f97583': 'magenta',
    '#ff7b72': 'red',

    // Strings/Green
    '#032f62': 'green',
    '#22863a': 'green',
    '#7ee787': 'green',

    // Functions/Blue
    '#005cc5': 'blue',
    '#0366d6': 'blue',
    '#79c0ff': 'cyan',
    '#58a6ff': 'blueBright',
    '#a5d6ff': 'cyan',

    // Numbers/Yellow
    '#e36209': 'yellow',
    '#d29922': 'yellow',
    '#ffa657': 'yellow',

    // Cyan
    '#0550ae': 'cyan',
  };

  const normalized = hex.toLowerCase();
  if (colorMap[normalized]) {
    return colorMap[normalized];
  }

  // Fallback: determine color by brightness/hue
  const r = Number.parseInt(normalized.slice(1, 3), 16);
  const g = Number.parseInt(normalized.slice(3, 5), 16);
  const b = Number.parseInt(normalized.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness < 80) return 'gray';
  if (r > g && r > b) return 'red';
  if (g > r && g > b) return 'green';
  if (b > r && b > g) return 'blue';
  if (r > 150 && g > 150) return 'yellow';
  if (g > 150 && b > 150) return 'cyan';
  if (r > 150 && b > 150) return 'magenta';

  return undefined;
}

function tokenScopeToColor(scopes: string[]): string | undefined {
  // Try to find the most specific scope match
  for (const scope of scopes) {
    if (TERMINAL_COLORS[scope]) {
      return TERMINAL_COLORS[scope];
    }

    // Try partial matches (e.g., "string.quoted.double" -> "string.quoted" -> "string")
    const parts = scope.split('.');
    for (let i = parts.length; i > 0; i--) {
      const key = parts.slice(0, i).join('.');
      if (TERMINAL_COLORS[key]) {
        return TERMINAL_COLORS[key];
      }
    }
  }

  return undefined;
}

// Async version using codeToTokens
export async function highlightCodeAsync(
  code: string,
  language?: string,
  theme: string = 'github-dark',
): Promise<ReactNode[] | null> {
  try {
    const result = await codeToTokens(code, {
      lang: (language || 'text') as any,
      theme: theme,
    });

    const nodes: ReactNode[] = [];
    let index = 0;

    for (let lineIndex = 0; lineIndex < result.tokens.length; lineIndex++) {
      const line = result.tokens[lineIndex];
      if (!line) continue;

      for (const token of line) {
        // Try to get color from hex first, then fall back to scope-based color
        let color: string | undefined;

        if (token.color) {
          color = hexToTerminalColor(token.color);
        }

        // If no color from hex, try to extract from explanation scopes
        if (!color && token.explanation) {
          const scopes = token.explanation.map(
            (e: any) => e.scopes?.[0]?.scopeName || '',
          );
          color = tokenScopeToColor(scopes);
        }

        nodes.push(
          <Text key={`token-${index}`} color={color}>
            {token.content}
          </Text>,
        );
        index++;
      }

      // Add newline between lines (but not after the last line)
      if (lineIndex < result.tokens.length - 1) {
        nodes.push(<Text key={`nl-${lineIndex}`}>{'\n'}</Text>);
      }
    }

    return nodes;
  } catch {
    // Silently fail and return null to fall back to plain text
    return null;
  }
}
