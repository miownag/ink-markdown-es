/** biome-ignore-all lint/suspicious/noArrayIndexKey: <empty> */

import { Box, Text } from 'ink';
import { type ReactNode, useEffect, useState } from 'react';
import { highlightCodeAsync } from './highlight';
import type { CodeRendererFn, ShikiCodeOptions } from './types';

interface ShikiCodeBlockProps {
  code: string;
  language?: string;
  theme: string;
}

function ShikiCodeBlock({
  code,
  language,
  theme,
}: ShikiCodeBlockProps): ReactNode {
  const [highlightedCode, setHighlightedCode] = useState<ReactNode[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function highlight() {
      try {
        const result = await highlightCodeAsync(code, language, theme);
        if (!cancelled) {
          setHighlightedCode(result);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHighlightedCode(null);
          setIsLoading(false);
        }
      }
    }

    highlight();
    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  if (isLoading || !highlightedCode) {
    return (
      <Box marginTop={1}>
        <Text>{code}</Text>
      </Box>
    );
  }

  return (
    <Box paddingX={2} paddingY={1} marginTop={1}>
      <Text>{highlightedCode}</Text>
    </Box>
  );
}

/**
 * Creates a code renderer function compatible with ink-markdown-es's
 * `renderers.code` prop signature.
 *
 * @example
 * import Markdown from 'ink-markdown-es';
 * import { createShikiCodeRenderer } from 'ink-shiki-code';
 *
 * const codeRenderer = createShikiCodeRenderer({ theme: 'nord' });
 *
 * <Markdown renderers={{ code: codeRenderer }}>
 *   {markdownContent}
 * </Markdown>
 */
export function createShikiCodeRenderer(
  options: ShikiCodeOptions = {},
): CodeRendererFn {
  const theme = options.theme ?? 'github-dark';

  return (
    code: string,
    language: string | undefined,
    _token: unknown,
  ): ReactNode => {
    return <ShikiCodeBlock code={code} language={language} theme={theme} />;
  };
}

export type { CodeRendererFn, ShikiCodeOptions };
