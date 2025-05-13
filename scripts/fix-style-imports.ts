// ✅ Relative path: scripts/fix-style-imports.ts

import path from 'path';
import fg from 'fast-glob';
import fs from 'fs-extra';

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^file:\/\//, '').replace(/%20/g, ' ')
);
const baseDir = path.resolve(__dirname, '../src/features');

(async () => {
  const pageFiles = await fg('**/pages/**/*.tsx', { cwd: baseDir, absolute: true });
  const log: string[] = [];

  for (const filePath of pageFiles) {
    const content = await fs.readFile(filePath, 'utf-8');

    const updated = content.replace(/import\s+['"]\.\/(.*?\.scss)['"]/g, (match, filename) => {
      log.push(`✔ Updated import in ${path.relative(baseDir, filePath)}: ${filename}`);
      return `import '../styles/${filename}'`;
    });

    if (content !== updated) {
      await fs.writeFile(filePath, updated, 'utf-8');
    }
  }

  console.log('✅ Style import fixes complete:');
  console.log(log.join('\n'));
})();
