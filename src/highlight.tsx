import hljs, { type HighlightResult } from 'highlight.js';
import { Text } from 'ink';
import type { ReactNode } from 'react';

const TERMINAL_COLORS: Record<string, string> = {
  keyword: 'magenta',
  'keyword.control': 'magenta',
  'keyword.operator': 'cyan',

  string: 'green',
  'string.special': 'greenBright',

  comment: 'gray',

  function: 'blue',
  'function.call': 'blueBright',
  'function.builtin': 'blueBright',

  variable: 'white',
  'variable.builtin': 'yellow',
  'variable.parameter': 'yellowBright',

  type: 'cyan',
  'type.builtin': 'cyanBright',
  class: 'yellowBright',

  number: 'yellow',
  'number.float': 'yellow',

  constant: 'yellow',
  'constant.builtin': 'yellowBright',

  operator: 'cyan',
  punctuation: 'white',

  property: 'blue',
  attribute: 'blue',

  tag: 'red',
  'tag.builtin': 'redBright',

  boolean: 'yellow',
  null: 'yellow',
  regexp: 'red',
  meta: 'gray',
  title: 'yellowBright',
  section: 'yellowBright',
};

function classToColor(className: string): string | undefined {
  if (TERMINAL_COLORS[className]) {
    return TERMINAL_COLORS[className];
  }

  const parts = className.replace(/^hljs-/, '').split('.');
  for (let i = parts.length; i > 0; i--) {
    const key = parts.slice(0, i).join('.');
    if (TERMINAL_COLORS[key]) {
      return TERMINAL_COLORS[key];
    }
  }

  return undefined;
}

/**
 * 解码 HTML 实体
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&quot;': '"',
    '&#34;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&amp;': '&',
    '&#38;': '&',
    '&nbsp;': ' ',
    '&#160;': ' ',
  };

  return text.replace(/&[a-z]+;|&#\d+;/gi, (match) => entities[match] || match);
}

function parseHighlightedCode(html: string): ReactNode[] {
  const result: ReactNode[] = [];
  const regex = /<span class="([^"]+)">([^<]*)<\/span>|([^<]+)/g;
  let index = 0;

  let match = regex.exec(html);
  while (match !== null) {
    if (match[1] && match[2] !== undefined) {
      const className = match[1];
      const text = decodeHtmlEntities(match[2]);
      const color = classToColor(className);

      result.push(
        <Text key={index} color={color}>
          {text}
        </Text>,
      );
    } else if (match[3]) {
      result.push(<Text key={index}>{decodeHtmlEntities(match[3])}</Text>);
    }
    index++;
    match = regex.exec(html);
  }

  return result;
}

export function highlightCode(
  code: string,
  language?: string,
): ReactNode[] | null {
  try {
    let highlighted: HighlightResult;

    if (language) {
      try {
        highlighted = hljs.highlight(code, { language });
      } catch {
        highlighted = hljs.highlightAuto(code);
      }
    } else {
      highlighted = hljs.highlightAuto(code);
    }

    return parseHighlightedCode(highlighted.value);
  } catch {
    return null;
  }
}
