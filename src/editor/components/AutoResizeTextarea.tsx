import React, { useRef, useEffect, useCallback, TextareaHTMLAttributes } from 'react';

export interface AutoResizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  defaultValue,
  value,
  className = '',
  onInput,
  minRows = 1,
  rows = 1,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
    const raf = requestAnimationFrame(adjustHeight);
    return () => cancelAnimationFrame(raf);
  }, [adjustHeight, defaultValue, value]);

  return (
    <textarea
      ref={textareaRef}
      className={`nodrag ${className}`.trim()}
      defaultValue={defaultValue}
      value={value}
      rows={minRows || rows}
      onInput={(e) => {
        adjustHeight();
        onInput?.(e);
      }}
      {...props}
    />
  );
};
