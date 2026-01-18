# ink-markdown-es

A modern performance markdown renderer for [ink](https://github.com/vadimdemedes/ink) using [marked](https://github.com/markedjs/marked).

Inspired by [ink-markdown](https://github.com/vadimdemedes/ink-markdown) and [prompt-kit](https://github.com/ibelick/prompt-kit).

Compare with [ink-markdown](https://github.com/vadimdemedes/ink-markdown):

- **ES module** support & only
- Use memo & useMemo to improve performance
- More flexible configuration (`renderers`  prop)

## Quick Start

```bash
npm install ink-markdown-es  # npm

pnpm add ink-markdown-es     # pnpm

bun add ink-markdown-es      # bun
```

```tsx
import Markdown from "ink-markdown-es";
import { render } from "ink";

const text = `# Hello World

This is a show case.
It's very fast!

## Features
- Render markdown in ink
- Support custom renderers
- **Bold text** and *italic text*
- Inline \`code\` support

### Code Block

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

> This is a blockquote
> with multiple lines

---

Check out [this link](https://example.com) for more info.

1. First item
2. Second item
3. Third item

| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |
`;

render(
  <Markdown
    showSharp
    renderers={{
      h1: (text) => (
        <Box padding={1} borderStyle="round" borderDimColor>
          <Text bold color="greenBright">
            {text}
          </Text>
        </Box>
      ),
    }}
  >
    {text}
  </Markdown>
);
```

<img width="1919" height="689" alt="image" src="https://github.com/user-attachments/assets/d7cc741d-4c52-4b27-b183-ca8cce13007b" />


## Contributing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```
