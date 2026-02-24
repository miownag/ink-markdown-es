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

If you wanna highlight the code part, you can use [ink-shiki-code](https://www.npmjs.com/package/ink-shiki-code).

```bash
bun add ink-shiki-code
```

```tsx
import { Box, render, Text, useInput } from "ink";
import { createShikiCodeRenderer } from "ink-shiki-code";
import { useEffect, useState } from "react";
import Markdown from "../src";

const text = `# Hello World

This is a show case.
It's very fast!

## Features
- Render markdown in ink
- Support custom renderers
- **Bold text** and *italic text*
- Inline \`code\` support
- **Syntax highlighting** via ink-shiki-code (opt-in)

### Code Block with Syntax Highlighting

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}
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

// Create a code renderer once, outside the component, to keep the reference stable.
const codeRenderer = createShikiCodeRenderer({ theme: "one-dark-pro" });

const TestApp = () => {
  useInput(() => {});
  const [content, setContent] = useState("");

  useEffect(() => {
    setInterval(() => {
      setContent((c) => text.slice(0, c.length + 20));
    }, 100);
  }, []);

  return (
    <Markdown
      showSharp
      renderers={{
        code: codeRenderer,
        h1: (text) => (
          <Box padding={1} borderStyle="round" borderDimColor>
            <Text bold color="greenBright">
              {text}
            </Text>
          </Box>
        ),
      }}
    >
      {content}
    </Markdown>
  );
};

render(<TestApp />);

```

<img width="1727" height="982" alt="image" src="https://github.com/user-attachments/assets/83da09b2-c533-4098-9938-227595bc015e" />

## Props

- `children` (string): The markdown content to render.
- `id` (string, optional): A unique identifier for the component. In AI scene, it's useful to identify the component in the DOM tree, you can use AI message id.
- `styles` (BlockStyles, optional): Custom styles for markdown blocks.
- `renderers` (BlockRenderers, optional): Custom renderers for markdown blocks.
- `showSharp` (boolean, optional): Whether to show sharp signs for headings. Default is `false`.

## Contributing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```
