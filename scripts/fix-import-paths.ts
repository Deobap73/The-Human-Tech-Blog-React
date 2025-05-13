// scripts/fix-all-imports.ts

import { Project } from 'ts-morph';
import path from 'path';

const ROOT_DIR = path.resolve();
const SRC_DIR = path.join(ROOT_DIR, 'src');

const project = new Project({
  tsConfigFilePath: path.join(ROOT_DIR, 'tsconfig.json'),
});

const sourceFiles = project.getSourceFiles(`${SRC_DIR}/**/*.ts*`);

const importFixes: { from: string; to: string }[] = [
  { from: '@/shared/utils/axios', to: './shared/utils/axios' },
  { from: '@/shared/utils/validation', to: './shared/utils/validation' },
  { from: '@/shared/context/ThemeContext', to: './shared/context/ThemeContext' },
  { from: '@/shared/context/AuthContext', to: './shared/context/AuthContext' },
  { from: '@/features/home/pages/HomePage', to: './features/home/pages/HomePage' },
  { from: '@/features/about/pages/AboutPage', to: './features/about/pages/AboutPage' },
  { from: '@/features/auth/pages/LoginPage', to: './features/auth/pages/LoginPage' },
  { from: '@/features/auth/pages/RegisterPage', to: './features/auth/pages/RegisterPage' },
];

for (const sourceFile of sourceFiles) {
  let changed = false;
  const imports = sourceFile.getImportDeclarations();

  for (const imp of imports) {
    const spec = imp.getModuleSpecifierValue();
    const fix = importFixes.find((f) => spec === f.from);
    if (fix) {
      imp.setModuleSpecifier(fix.to);
      changed = true;
    }
  }

  if (changed) {
    sourceFile.saveSync();
    console.log(`✅ Updated: ${sourceFile.getBaseName()}`);
  }
}

console.log('🔁 Import path refactor completed.');
