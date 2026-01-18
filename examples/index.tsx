import Markdown from '../src/index';
import { render } from 'ink';

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

render(<Markdown showSharp>{text}</Markdown>);
