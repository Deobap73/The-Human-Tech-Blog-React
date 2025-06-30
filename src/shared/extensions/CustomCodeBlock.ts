// /src/shared/extensions/CustomCodeBlock.ts

import { ReactNodeViewRenderer } from '@tiptap/react';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import type { LanguageFn } from 'highlight.js';

import ts from 'highlight.js/lib/languages/typescript';
import js from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';

import CodeBlockComponent from '../../shared/components/CodeBlockComponent';

// Cria instância do lowlight com tipo inferido corretamente
const lowlight = createLowlight() as ReturnType<typeof createLowlight>;

// Regista linguagens suportadas corretamente
lowlight.register('typescript', ts as LanguageFn);
lowlight.register('javascript', js as LanguageFn);
lowlight.register('html', html as LanguageFn);
lowlight.register('css', css as LanguageFn);
lowlight.register('json', json as LanguageFn);

export const CustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      language: {
        default: 'typescript',
        parseHTML: (element) => element.getAttribute('data-language') || 'typescript',
        renderHTML: (attributes) => ({
          'data-language': attributes.language,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
}).configure({
  lowlight,
});
