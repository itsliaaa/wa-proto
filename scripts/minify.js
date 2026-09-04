const { readFileSync, writeFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { build } = require('esbuild')
const { minify } = require('terser')

;(async () => {
  const filePath = resolve(__dirname, '../dist/index.js')

  const HEADER = `// This proto is not obfuscated. It is minified solely for bundle-size reduction`

  const result = await build({
    entryPoints: [filePath],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: 'es2020',
    treeShaking: true,
    minify: false
  })

  const code = result.outputFiles[0].text

  if (!code)
    throw new Error('❌ Empty return from esbuild')

  const terser = await minify(code, {
    module: true,
    compress: {
      passes: 3,
      toplevel: true,
      defaults: true
    },
    mangle: {
      toplevel: true
    },
    format: {
      comments: false,
      beautify: false
    },
    ecma: 2020
  })

  if (!terser.code)
    throw new Error('❌ Empty return from Terser')

  writeFileSync(filePath, HEADER + '\n' + terser.code, 'utf8')
  console.log(`✅ Minified in ${filePath}`)
})().catch((error) => {
  console.error(error)
  console.error(`❌ Minify error: ${error.message}`)
})