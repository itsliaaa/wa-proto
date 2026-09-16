const { readFileSync, writeFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { build } = require('esbuild')

;(async () => {
  const filePath = resolve(__dirname, '../dist/index.js')

  const HEADER = `// This proto is not obfuscated. It is minified solely for bundle-size reduction`

  const result = await build({
    entryPoints: [filePath],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    target: 'es2022',
    minify: true
  })

  const code = result.outputFiles[0].text

  if (!code)
    throw new Error('❌ Empty return from esbuild')

  writeFileSync(filePath, HEADER + '\n' + code, 'utf8')
  console.log(`✅ Minified in ${filePath}`)
})().catch((error) => {
  console.error(error)
  console.error(`❌ Minify error: ${error.message}`)
})