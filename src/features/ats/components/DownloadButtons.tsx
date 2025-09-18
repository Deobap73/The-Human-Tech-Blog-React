// /src/features/ats/components/DownloadButtons.tsx
// Description: Client-side exporters for DOCX and PDF. No server load.// Uses dynamic imports to avoid bloating initial bundle.

import React, { useCallback, useState } from 'react';
import '../styles/DownloadButtons.scss';

interface DownloadButtonsProps {
  content: string;
  disabled?: boolean;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ content, disabled = false }) => {
  const [downloading, setDownloading] = useState<boolean>(false);

  const downloadDocx = useCallback(async () => {
    setDownloading(true);
    try {
      const { Document, Packer, Paragraph } = await import('docx');
      const paragraphs = content.split('\n').map((line) => new Paragraph(line));
      const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cover-letter.docx';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('DOCX export error:', err);
      alert('Could not export DOCX. Please try again.');
    } finally {
      setDownloading(false);
    }
    return;
  }, [content]);

  const downloadPdf = useCallback(async () => {
    setDownloading(true);
    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(content || ' ', 180);
      doc.text(lines, 10, 10);
      doc.save('cover-letter.pdf');
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not export PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
    return;
  }, [content]);

  return (
    <div className='download-btns'>
      <button
        className='download-btns__btn'
        onClick={downloadDocx}
        disabled={disabled || downloading}
        aria-disabled={disabled || downloading}>
        {downloading ? 'Processing…' : 'Download DOCX'}
      </button>
      <button
        className='download-btns__btn'
        onClick={downloadPdf}
        disabled={disabled || downloading}
        aria-disabled={disabled || downloading}>
        {downloading ? 'Processing…' : 'Download PDF'}
      </button>
    </div>
  );
};

export default DownloadButtons;
