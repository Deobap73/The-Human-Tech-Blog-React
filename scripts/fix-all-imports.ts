// ✅ Relative path: scripts/fix-all-imports.ts

import path from 'path';
import fg from 'fast-glob';
import fs from 'fs-extra';

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^file:\/\//, '').replace(/%20/g, ' ')
);
const baseDir = path.resolve(__dirname, '../src');

(async () => {
  const tsxFiles = await fg('**/*.tsx', { cwd: baseDir, absolute: true });
  const changes: string[] = [];

  for (const filePath of tsxFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    let updated = content;

    // Corrige imports de ./features/... para @/features/...
    updated = updated.replace(/['"]\.\/features\//g, '"@/features/');
    // Corrige imports de ../pages/... para @/pages/...
    updated = updated.replace(/['"]\.\.\/pages\//g, '"@/pages/');
    // Corrige imports quebrados com ./HomePage.scss para ../styles/HomePage.scss
    updated = updated.replace(/import\s+['"]\.\/([\w-]+\.scss)['"]/g, 'import "../styles/$1"');

    if (updated !== content) {
      await fs.writeFile(filePath, updated, 'utf-8');
      changes.push(`✔ Fixed imports in: ${path.relative(baseDir, filePath)}`);
    }
  }

  console.log('✅ Import path fixes complete');
  changes.forEach((c) => console.log(c));
})();
