const fs = require('fs');
const path = require('path');
const { compile, optimize } = require('@tailwindcss/node');
const { Scanner } = require('@tailwindcss/oxide');

async function buildCSS() {
  const rootDir = path.resolve(__dirname, '..');
  const srcFile = path.join(rootDir, 'src', 'app', 'globals.src.css');
  const outFile = path.join(rootDir, 'src', 'app', 'globals.css');

  console.log('Compiling Tailwind CSS from:', srcFile);
  const css = fs.readFileSync(srcFile, 'utf-8');

  const compiler = await compile(css, {
    base: rootDir,
    from: srcFile,
    onDependency: () => {}
  });

  const scanner = new Scanner({
    sources: [
      {
        base: path.join(rootDir, 'src'),
        pattern: '**/*.{tsx,ts,jsx,js,html}',
        negated: false
      }
    ]
  });

  const candidates = scanner.scan();
  console.log(`Found ${candidates.length} candidates in src/`);

  let compiled = compiler.build(candidates);

  try {
    const optimized = optimize(compiled, { minify: false });
    if (optimized && optimized.code) {
      compiled = optimized.code;
    }
  } catch (err) {
    console.warn('Optimization skipped:', err.message);
  }

  fs.writeFileSync(outFile, compiled, 'utf-8');
  console.log(`Successfully generated ${outFile} (${(compiled.length / 1024).toFixed(1)} KB)`);
}

buildCSS().catch((err) => {
  console.error('Failed to compile CSS:', err);
  process.exit(1);
});
