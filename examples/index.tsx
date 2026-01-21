import { Box, render, Text, useInput } from 'ink';
import Markdown from '../src';

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
