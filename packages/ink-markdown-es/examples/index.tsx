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
