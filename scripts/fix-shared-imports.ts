// ✅ Relative path: scripts/fix-shared-imports.ts

import path from 'path';
import { Project } from 'ts-morph';

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^file:\/\//, '').replace(/%20/g, ' ')
);

const project = new Project({ tsConfigFilePath: path.join(__dirname, '../tsconfig.json') });
const sourceFiles = project.getSourceFiles();
const updated: string[] = [];

sourceFiles.forEach((source) => {
  const imports = source.getImportDeclarations();

  imports.forEach((imp) => {
    const val = imp.getModuleSpecifierValue();
    if (val.startsWith('shared/')) {
      imp.setModuleSpecifier(`@/${val}`);
      updated.push(`${source.getBaseName()}: ${val} → @/${val}`);
    }
  });
});

(async () => {
  await project.save();
  console.log('✅ Updated imports:');
  console.log(updated.join('\n'));
})();
