// File: /src/types/external-modules.d.ts
// Description: Ambient module declarations for libraries used via dynamic import.
// IMPORTANT: Keep this until you install the real packages (which include proper types).

declare module 'docx' {
  // Minimal typings to satisfy TS in strict mode when using dynamic import.
  export class Document {
    constructor(options?: any);
  }
  export class Packer {
    static toBlob(doc: any): Promise<Blob>;
  }
  export class Paragraph {
    constructor(text?: string);
  }
}

declare module 'jspdf' {
  // Default export is a class in modern versions
  const jsPDF: {
    new (...args: any[]): {
      splitTextToSize: (text: string, size: number) => string[];
      text: (text: string[] | string, x: number, y: number) => void;
      save: (filename: string) => void;
    };
    // Some bundlers/types use default export directly
    default?: any;
  };
  export default jsPDF;
}
