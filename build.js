const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

async function build() {
  if (!isWatch) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  const extensionConfig = {
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'out/extension.js',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    target: 'node16',
    sourcemap: true,
    minify: false,
  };

  const webviewConfig = {
    entryPoints: ['src/editor/main.tsx'],
    bundle: true,
    outfile: 'out/editor/bundle.js',
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    sourcemap: true,
    minify: false,
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  };

  if (isWatch) {
    const extCtx = await esbuild.context(extensionConfig);
    const webviewCtx = await esbuild.context(webviewConfig);
    await Promise.all([extCtx.watch(), webviewCtx.watch()]);
    console.log('Watching for changes in extension and webview...');
  } else {
    await Promise.all([
      esbuild.build(extensionConfig),
      esbuild.build(webviewConfig),
    ]);
    console.log('Build completed successfully.');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
