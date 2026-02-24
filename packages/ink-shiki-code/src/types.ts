import type { ReactNode } from 'react';

export interface ShikiCodeOptions {
  /**
   * Shiki theme name.
   * @default 'github-dark'
   * @see https://shiki.style/themes
   */
  theme?: string;
}

/**
 * The function signature compatible with ink-markdown-es's renderers.code.
 * The third argument (token) is typed unknown to avoid a marked dependency.
 */
export type CodeRendererFn = (
  code: string,
  language: string | undefined,
  token: unknown,
) => ReactNode;
