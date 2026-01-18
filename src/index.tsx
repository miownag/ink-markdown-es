/** biome-ignore-all lint/suspicious/noArrayIndexKey: <empty> */
import { memo, useMemo, useId, type ReactNode } from 'react';
import { marked, type Token, type Tokens } from 'marked';
import { Text, Box } from 'ink';
import type {
  BlockRenderers,
  BlockStyles,
  HeadingStyleProps,
  HrStyleProps,
  ListItemStyleProps,
  MarkdownProps,
  MemoizedBlockProps,
} from './types';
import { extractBoxProps, extractTextProps, mergeStyles } from './utils';
import { DEFAULT_STYLES } from './constants';

function renderInlineTokens(
  tokens: Token[] | undefined,
  styles: BlockStyles,
  renderers: BlockRenderers,
): ReactNode {
  if (!tokens || tokens.length === 0) return null;

  return tokens.map((token, index) => {
    const key = `inline-${index}`;

    switch (token.type) {
      case 'text':
      case 'escape': {
        const textToken = token as Tokens.Text | Tokens.Escape;
        if ('tokens' in textToken && textToken.tokens) {
          return (
            <Text key={key}>
              {renderInlineTokens(textToken.tokens, styles, renderers)}
            </Text>
          );
        }
        return <Text key={key}>{textToken.text}</Text>;
      }

      case 'strong': {
        const strongToken = token as Tokens.Strong;
        const strongStyle = mergeStyles(DEFAULT_STYLES.strong, styles.strong);
        if (renderers.strong) {
          return (
            <Text key={key}>
              {renderers.strong(
                renderInlineTokens(strongToken.tokens, styles, renderers),
                strongToken,
              )}
            </Text>
          );
        }
        return (
          <Text key={key} {...extractTextProps(strongStyle)}>
            {renderInlineTokens(strongToken.tokens, styles, renderers)}
          </Text>
        );
      }

      case 'em': {
        const emToken = token as Tokens.Em;
        const emStyle = mergeStyles(DEFAULT_STYLES.em, styles.em);
        if (renderers.em) {
          return (
            <Text key={key}>
              {renderers.em(
                renderInlineTokens(emToken.tokens, styles, renderers),
                emToken,
              )}
            </Text>
          );
        }
        return (
          <Text key={key} {...extractTextProps(emStyle)}>
            {renderInlineTokens(emToken.tokens, styles, renderers)}
          </Text>
        );
      }

      case 'del': {
        const delToken = token as Tokens.Del;
        const delStyle = mergeStyles(DEFAULT_STYLES.del, styles.del);
        if (renderers.del) {
          return (
            <Text key={key}>
              {renderers.del(
                renderInlineTokens(delToken.tokens, styles, renderers),
                delToken,
              )}
            </Text>
          );
        }
        return (
          <Text key={key} {...extractTextProps(delStyle)}>
            {renderInlineTokens(delToken.tokens, styles, renderers)}
          </Text>
        );
      }

      case 'codespan': {
        const codespanToken = token as Tokens.Codespan;
        const codespanStyle = mergeStyles(
          DEFAULT_STYLES.codespan,
          styles.codespan,
        );
        if (renderers.codespan) {
          return (
            <Text key={key}>
              {renderers.codespan(codespanToken.text, codespanToken)}
            </Text>
          );
        }
        return (
          <Text key={key} {...extractTextProps(codespanStyle)}>
            {codespanToken.text}
          </Text>
        );
      }

      case 'link': {
        const linkToken = token as Tokens.Link;
        const linkStyle = mergeStyles(DEFAULT_STYLES.link, styles.link);
        if (renderers.link) {
          return (
            <Text key={key}>
              {renderers.link(
                linkToken.text,
                linkToken.href,
                linkToken.title,
                linkToken,
              )}
            </Text>
          );
        }
        return (
          <Text key={key} {...extractTextProps(linkStyle)}>
            {linkToken.text}
            {linkToken.href && ` (${linkToken.href})`}
          </Text>
        );
      }

      case 'image': {
        const imageToken = token as Tokens.Image;
        const imageStyle = mergeStyles(DEFAULT_STYLES.image, styles.image);
        if (renderers.image) {
          return (
            <Text key={key}>
              {renderers.image(
                imageToken.text,
                imageToken.href,
                imageToken.title,
                imageToken,
              )}
            </Text>
          );
        }
        return (
          <Text key={key} {...extractTextProps(imageStyle)}>
            [Image: {imageToken.text || imageToken.href}]
          </Text>
        );
      }

      case 'br': {
        return <Text key={key}>{'\n'}</Text>;
      }

      default:
        if ('text' in token) {
          return <Text key={key}>{(token as { text: string }).text}</Text>;
        }
        return null;
    }
  });
}

function renderBlockToken(
  token: Token,
  styles: BlockStyles,
  renderers: BlockRenderers,
  showSharp?: boolean,
): ReactNode {
  switch (token.type) {
    case 'heading': {
      const headingToken = token as Tokens.Heading;
      const headingKey = `h${headingToken.depth}` as keyof BlockRenderers;
      const styleKey = `h${headingToken.depth}` as keyof BlockStyles;

      const renderer = renderers[headingKey] as
        | ((text: string, token: Tokens.Heading) => ReactNode)
        | undefined;
      if (renderer) {
        return renderer(headingToken.text, headingToken);
      }

      const headingStyle = mergeStyles(
        DEFAULT_STYLES[styleKey] as HeadingStyleProps,
        styles[styleKey] as HeadingStyleProps,
      );

      const mergedShowSharp =
        typeof headingStyle.showSharp === 'boolean'
          ? headingStyle.showSharp
          : Boolean(showSharp);

      return (
        <Box {...extractBoxProps(headingStyle)}>
          <Text {...extractTextProps(headingStyle)}>
            {mergedShowSharp && `${'#'.repeat(headingToken.depth)} `}
            {renderInlineTokens(headingToken.tokens, styles, renderers)}
          </Text>
        </Box>
      );
    }

    case 'paragraph': {
      const paragraphToken = token as Tokens.Paragraph;
      const paragraphStyle = mergeStyles(
        DEFAULT_STYLES.paragraph,
        styles.paragraph,
      );

      const content = renderInlineTokens(
        paragraphToken.tokens,
        styles,
        renderers,
      );

      if (renderers.paragraph) {
        return renderers.paragraph(content, paragraphToken);
      }

      return (
        <Box {...extractBoxProps(paragraphStyle)}>
          <Text {...extractTextProps(paragraphStyle)}>{content}</Text>
        </Box>
      );
    }

    case 'code': {
      const codeToken = token as Tokens.Code;
      const codeStyle = mergeStyles(DEFAULT_STYLES.code, styles.code);

      if (renderers.code) {
        return renderers.code(codeToken.text, codeToken.lang, codeToken);
      }
      return (
        <Box {...extractBoxProps(codeStyle)}>
          <Text {...extractTextProps(codeStyle)}>{codeToken.text}</Text>
        </Box>
      );
    }

    case 'blockquote': {
      const blockquoteToken = token as Tokens.Blockquote;
      const blockquoteStyle = mergeStyles(
        DEFAULT_STYLES.blockquote,
        styles.blockquote,
      );

      const content = blockquoteToken.tokens.map((t, i) => (
        <Box key={`bq-${i}`}>{renderBlockToken(t, styles, renderers)}</Box>
      ));

      if (renderers.blockquote) {
        return renderers.blockquote(<>{content}</>, blockquoteToken);
      }

      return (
        <Box {...extractBoxProps(blockquoteStyle)}>
          <Box flexDirection="column">
            {blockquoteToken.tokens.map((t, i) => {
              const rendered = renderBlockToken(t, styles, renderers);
              if (rendered) {
                return (
                  <Text
                    key={`bq-text-${i}`}
                    {...extractTextProps(blockquoteStyle)}
                  >
                    {t.type === 'paragraph'
                      ? renderInlineTokens(
                          (t as Tokens.Paragraph).tokens,
                          styles,
                          renderers,
                        )
                      : (t as { text?: string }).text || ''}
                  </Text>
                );
              }
              return null;
            })}
          </Box>
        </Box>
      );
    }

    case 'list': {
      const listToken = token as Tokens.List;
      const listStyle = mergeStyles(DEFAULT_STYLES.list, styles.list);
      const listItemStyle = mergeStyles(
        DEFAULT_STYLES.listItem,
        styles.listItem,
      ) as ListItemStyleProps;

      const bullet = listItemStyle.bullet || '●';

      const items = listToken.items.map((item, index) => {
        const start = typeof listToken.start === 'number' ? listToken.start : 1;
        const prefix = listToken.ordered ? `${start + index}. ` : `${bullet} `;

        const itemContent = renderInlineTokens(item.tokens, styles, renderers);

        if (renderers.listItem) {
          return (
            <Box key={`li-${index}`} {...extractBoxProps(listItemStyle)}>
              {renderers.listItem(itemContent, item)}
            </Box>
          );
        }

        return (
          <Box key={`li-${index}`} {...extractBoxProps(listItemStyle)}>
            <Text {...extractTextProps(listItemStyle)}>
              {prefix}
              {itemContent}
            </Text>
          </Box>
        );
      });

      if (renderers.list) {
        return renderers.list(items, listToken.ordered, listToken);
      }

      return (
        <Box flexDirection="column" {...extractBoxProps(listStyle)}>
          {items}
        </Box>
      );
    }

    case 'hr': {
      const hrToken = token as Tokens.Hr;
      const hrStyle = mergeStyles(DEFAULT_STYLES.hr, styles.hr) as HrStyleProps;
      const char = hrStyle.char || '─';
      const width = hrStyle.width || 40;

      if (renderers.hr) {
        return renderers.hr(hrToken);
      }

      return (
        <Box {...extractBoxProps(hrStyle)}>
          <Text {...extractTextProps(hrStyle)}>{char.repeat(width)}</Text>
        </Box>
      );
    }

    case 'table': {
      const tableToken = token as Tokens.Table;
      const tableStyle = mergeStyles(DEFAULT_STYLES.table, styles.table);
      const cellStyle = mergeStyles(DEFAULT_STYLES.tableCell, styles.tableCell);

      const headerCells = tableToken.header.map((cell, i) => (
        <Box key={`th-${i}`} {...extractBoxProps(cellStyle)}>
          <Text bold {...extractTextProps(cellStyle)}>
            {renderInlineTokens(cell.tokens, styles, renderers)}
          </Text>
        </Box>
      ));

      const header = <Box flexDirection="row">{headerCells}</Box>;

      const bodyRows = tableToken.rows.map((row, rowIndex) => (
        <Box key={`tr-${rowIndex}`} flexDirection="row">
          {row.map((cell, cellIndex) => (
            <Box key={`td-${cellIndex}`} {...extractBoxProps(cellStyle)}>
              <Text {...extractTextProps(cellStyle)}>
                {renderInlineTokens(cell.tokens, styles, renderers)}
              </Text>
            </Box>
          ))}
        </Box>
      ));

      const body = <>{bodyRows}</>;

      if (renderers.table) {
        return renderers.table(header, body, tableToken);
      }

      return (
        <Box flexDirection="column" {...extractBoxProps(tableStyle)}>
          {header}
          {body}
        </Box>
      );
    }

    case 'space': {
      return <Text>{'\n'}</Text>;
    }

    case 'html': {
      const htmlToken = token as Tokens.HTML;
      return <Text dimColor>{htmlToken.text}</Text>;
    }

    default:
      if ('text' in token) {
        return <Text>{(token as { text: string }).text}</Text>;
      }
      return null;
  }
}

const MemoizedBlock = memo(
  function MemoizedBlock({
    token,
    styles,
    renderers,
    showSharp,
  }: MemoizedBlockProps) {
    return <>{renderBlockToken(token, styles, renderers, showSharp)}</>;
  },
  (prevProps, nextProps) => prevProps.token === nextProps.token,
);

MemoizedBlock.displayName = 'MemoizedBlock';

function MarkdownComponent({
  children,
  styles = {},
  renderers = {},
  showSharp = false,
}: MarkdownProps) {
  const generatedId = useId();

  const tokens = useMemo(() => {
    return marked.lexer(children);
  }, [children]);

  return (
    <Box flexDirection="column">
      {tokens.map((token, index) => (
        <MemoizedBlock
          key={`${generatedId}-block-${index}`}
          token={token}
          styles={styles}
          renderers={renderers}
          showSharp={showSharp}
        />
      ))}
    </Box>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = 'Markdown';

export default Markdown;
export type { Token, Tokens };
