// Path: /src/features/post/components/ColorPicker.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Editor } from '@tiptap/react';
import '../styles/ColorPicker.scss';

interface ColorPickerProps {
  editor: Editor;
}

/** Template literal type for hex color strings like "#FFAA00". */
type HexColor = `#${string}`;

/**
 * ColorPicker (button-root + portal panel)
 * - Root is a BUTTON with the same toolbar classes for full uniformity.
 * - Panel is rendered via a Portal and absolutely positioned using button's DOMRect.
 * - Supports quick swatches, custom color input, and clear action.
 * - Closes on outside click and on Escape.
 */
const ColorPicker = ({ editor }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<HexColor>('#1da1f2');
  const [panelPos, setPanelPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const activeColor: string | undefined = useMemo(() => {
    const colorAttr = editor.getAttributes('textStyle')?.color as string | undefined;
    return colorAttr;
  }, [editor]);

  const palette: HexColor[] = useMemo(
    () =>
      [
        '#000000',
        '#4B5563', // gray-600
        '#EF4444', // red-500
        '#F59E0B', // amber-500
        '#10B981', // emerald-500
        '#1da1f2', // blue-500
        '#8B5CF6', // violet-500
        '#EC4899', // pink-500
        '#FFFFFF',
      ] as HexColor[],
    []
  );

  const applyColor = (hex: HexColor): void => {
    editor.chain().focus().setColor(hex).run();
  };

  const clearColor = (): void => {
    editor.chain().focus().unsetColor().run();
  };

  /** Compute absolute position for the panel (below the trigger, 8px gap). */
  const updatePanelPosition = (): void => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPanelPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
  };

  /** Toggle open state and (when opening) compute the position. */
  const handleToggle = (): void => {
    if (!isOpen) {
      updatePanelPosition();
    }
    setIsOpen((v) => !v);
  };

  /** Close on ESC and click-outside. */
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      const clickedInsidePanel = !!(panelRef.current && t && panelRef.current.contains(t));
      const clickedOnTrigger = !!(triggerRef.current && t && triggerRef.current.contains(t));
      if (!clickedInsidePanel && !clickedOnTrigger) setIsOpen(false);
    };

    const onReposition = () => updatePanelPosition();

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {/* Root button: uniform with other toolbar buttons */}
      <button
        ref={triggerRef}
        type='button'
        className={
          'editor-toolbar__btn color-picker' + (activeColor ? ' editor-toolbar__btn--active' : '')
        }
        aria-label={activeColor ? `Text color (${activeColor})` : 'Text color'}
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        onClick={handleToggle}>
        <span className='color-picker__glyph'>A</span>
        <span
          className='color-picker__indicator'
          style={{ backgroundColor: activeColor || 'transparent' }}
        />
      </button>

      {/* Portal panel */}
      {isOpen &&
        createPortal(
          <div
            ref={panelRef}
            className='color-picker__panel'
            role='dialog'
            aria-label='Choose text color'
            style={{ top: `${panelPos.top}px`, left: `${panelPos.left}px` }}>
            <div className='color-picker__row'>
              {palette.map((hex) => (
                <button
                  type='button'
                  key={hex}
                  className={
                    'color-picker__swatch' +
                    (activeColor?.toLowerCase() === hex.toLowerCase()
                      ? ' color-picker__swatch--active'
                      : '')
                  }
                  style={{ backgroundColor: hex }}
                  aria-label={`Set color ${hex}`}
                  onClick={() => applyColor(hex)}
                />
              ))}
            </div>

            <div className='color-picker__custom'>
              <label className='color-picker__label' htmlFor='color-picker-input'>
                Custom
              </label>
              <input
                id='color-picker-input'
                className='color-picker__input'
                type='color'
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value as HexColor)}
                onBlur={(e) => setCustomColor(e.target.value as HexColor)}
                aria-label='Custom color'
              />
              <button
                type='button'
                className='color-picker__apply editor-toolbar__btn'
                onClick={() => applyColor(customColor)}>
                Apply
              </button>
              <button
                type='button'
                className='color-picker__clear editor-toolbar__btn'
                onClick={clearColor}>
                Clear
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ColorPicker;
