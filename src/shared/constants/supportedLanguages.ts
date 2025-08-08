// /src/shared/constants/supportedLanguages.ts

/**
 * Central list of supported languages for code blocks,
 * used by editor dropdown and highlight.js registration.
 */
export const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'react', // Will highlight as javascript
  'html', // highlight.js uses 'xml' under the hood
  'css',
  'scss',
  'json',
  'python',
  'java',
  'go',
  'rust',
  'csharp', // Alias: 'csharp' and 'c#'
  'c#',
  'sql',
  'bash',
  'markdown',
];
