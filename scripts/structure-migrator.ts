// ✅ Relative path: scripts/structure-migrator.ts

import fs from 'fs-extra';
import path, { dirname } from 'path';
import { Project } from 'ts-morph';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = path.resolve(__dirname, '../src');
const log: string[] = [];

const fileMoves: { from: string; to: string }[] = [
  // Refatoração de hooks para seus domínios ou pasta comum
  { from: 'hooks/useAuth.ts', to: 'features/auth/services/useAuth.ts' },
  { from: 'hooks/usePosts.ts', to: 'features/post/services/usePosts.ts' },
  { from: 'hooks/useTheme.ts', to: 'shared/hooks/useTheme.ts' },
];

async function migrate() {
  for (const move of fileMoves) {
    const fromPath = path.join(root, move.from);
    const toPath = path.join(root, move.to);
    try {
      await fs.ensureDir(path.dirname(toPath));
      await fs.move(fromPath, toPath, { overwrite: true });
      log.push(`✔ Moved: ${move.from} → ${move.to}`);
    } catch (err) {
      log.push(`✘ Error moving ${move.from}: ${(err as Error).message}`);
    }
  }

  const project = new Project({ tsConfigFilePath: path.join(root, '../tsconfig.json') });
  const sourceFiles = project.getSourceFiles();

  fileMoves.forEach(({ from, to }) => {
    const importPathOld = from
      .replace(/\\/g, '/')
      .replace(/\.tsx?$/, '')
      .replace(/^hooks\//, './hooks/');
    const importPathNew = to
      .replace(/\\/g, '/')
      .replace(/\.tsx?$/, '')
      .replace(/^features\//, './features/')
      .replace(/^shared\//, './shared/');

    sourceFiles.forEach((source) => {
      const imports = source.getImportDeclarations();
      imports.forEach((i) => {
        if (i.getModuleSpecifierValue().includes(importPathOld)) {
          i.setModuleSpecifier(importPathNew);
          log.push(`✔ Updated import in ${source.getBaseName()}`);
        }
      });
    });
  });

  await project.save();

  const logFile = path.join(__dirname, 'migration-log.txt');
  fs.writeFileSync(logFile, log.join('\n'), 'utf-8');
  console.log('✅ Migration completed. Log saved to', logFile);
}

migrate();
