# ink-markdown-es

A modern performance markdown renderer for [ink](https://github.com/vadimdemedes/ink) using [marked](https://github.com/markedjs/marked).

Inspired by [ink-markdown](https://github.com/vadimdemedes/ink-markdown) and [prompt-kit](https://github.com/ibelick/prompt-kit).

Compare with [ink-markdown](https://github.com/vadimdemedes/ink-markdown):

- ES module
- Use memo to cache rendered output

## Quick Start

```bash
npm install ink-markdown-es
#or
pnpm add ink-markdown-es
#or
bun add ink-markdown-es
```

```tsx
import { Markdown } from "../index";
import { render } from "ink";
import chalk from "chalk";

const text = `
# Hello World

## Features

- Render markdown in ink
- Support custom renderers
`;

render(
  <Markdown renderOptions={{ firstHeading: chalk.bgAnsi256(99) }}>
    {text}
  </Markdown>,
);
```

## Contributing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
