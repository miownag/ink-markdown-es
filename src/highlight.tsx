import { Text } from 'ink';
import type { ReactNode } from 'react';
import { codeToTokens } from 'shiki';

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
        // Directly use hex color from Shiki token (Ink v6 supports hex colors)
        const color = token.color || undefined;

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
