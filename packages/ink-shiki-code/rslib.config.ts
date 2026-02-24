import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['node 20'],
      dts: true,
    },
  ],
  output: {
    target: 'node',
    externals: ['react', 'react/jsx-runtime', 'ink'],
  },
  plugins: [pluginReact()],
});
