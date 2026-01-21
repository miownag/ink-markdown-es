import type { Box, Text } from 'ink';
import type { Token, Tokens } from 'marked';
import type { ComponentProps, ReactNode } from 'react';

export type TextStyleProps = Pick<
  ComponentProps<typeof Text>,
  | 'color'
  | 'backgroundColor'
  | 'dimColor'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'inverse'
  | 'wrap'
>;

export type BoxStyleProps = ComponentProps<typeof Box>;

export type HeadingStyleProps = TextStyleProps &
  BoxStyleProps & {
    showSharp?: boolean;
  };

export type ListItemStyleProps = TextStyleProps &
  BoxStyleProps & {
    bullet?: string;
  };

export type HrStyleProps = TextStyleProps &
  BoxStyleProps & {
    char?: string;
    width?: number;
  };

export type BlockStyles = {
  h1?: HeadingStyleProps;
  h2?: HeadingStyleProps;
  h3?: HeadingStyleProps;
  h4?: HeadingStyleProps;
  h5?: HeadingStyleProps;
  h6?: HeadingStyleProps;
  paragraph?: TextStyleProps & BoxStyleProps;
  blockquote?: TextStyleProps & BoxStyleProps;
  code?: TextStyleProps & BoxStyleProps;
  codespan?: TextStyleProps;
  list?: BoxStyleProps;
  listItem?: ListItemStyleProps;
  hr?: HrStyleProps;
  link?: TextStyleProps;
  strong?: TextStyleProps;
  em?: TextStyleProps;
  del?: TextStyleProps;
  image?: TextStyleProps;
  table?: BoxStyleProps;
  tableCell?: TextStyleProps & BoxStyleProps;
};

export type BlockRenderers = {
  h1?: (text: string, token: Tokens.Heading) => ReactNode;
  h2?: (text: string, token: Tokens.Heading) => ReactNode;
  h3?: (text: string, token: Tokens.Heading) => ReactNode;
  h4?: (text: string, token: Tokens.Heading) => ReactNode;
  h5?: (text: string, token: Tokens.Heading) => ReactNode;
  h6?: (text: string, token: Tokens.Heading) => ReactNode;
  paragraph?: (content: ReactNode, token: Tokens.Paragraph) => ReactNode;
  code?: (
    code: string,
    language: string | undefined,
    token: Tokens.Code,
  ) => ReactNode;
  list?: (
    items: ReactNode[],
    ordered: boolean,
    token: Tokens.List,
  ) => ReactNode;
  listItem?: (content: ReactNode, token: Tokens.ListItem) => ReactNode;
  blockquote?: (content: ReactNode, token: Tokens.Blockquote) => ReactNode;
  hr?: (token: Tokens.Hr) => ReactNode;
  link?: (
    text: string,
    href: string,
    title: string | null | undefined,
    token: Tokens.Link,
  ) => ReactNode;
  image?: (
    alt: string,
    src: string,
    title: string | null,
    token: Tokens.Image,
  ) => ReactNode;
  codespan?: (code: string, token: Tokens.Codespan) => ReactNode;
  strong?: (content: ReactNode, token: Tokens.Strong) => ReactNode;
  em?: (content: ReactNode, token: Tokens.Em) => ReactNode;
  del?: (content: ReactNode, token: Tokens.Del) => ReactNode;
  table?: (
    header: ReactNode,
    body: ReactNode,
    token: Tokens.Table,
  ) => ReactNode;
};

export type MarkdownProps = {
  children: string;
  id?: string;
  styles?: BlockStyles;
  renderers?: BlockRenderers;
  showSharp?: boolean;
  /**
   * Enable syntax highlighting for code blocks
   * @default true
   */
  highlight?: boolean;
};

export type MemoizedBlockProps = {
  token: Token;
  styles: BlockStyles;
  renderers: BlockRenderers;
  showSharp: boolean;
  highlight: boolean;
};
