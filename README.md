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
const text = `# Hello World

This is a show case.
It's very fast!

## Features
- Render markdown in ink
- Support custom renderers
- **Bold text** and *italic text*
- Inline \`code\` support
- **Syntax highlighting** for code blocks powered by highlight.js

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

const TestApp = () => {
  useInput(() => {});

  return (
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
};

render(<TestApp />);

```

<img width="1904" height="964" alt="image" src="https://github.com/user-attachments/assets/bed0c942-6d08-4f24-a42a-4999bdf1fc85" />

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
