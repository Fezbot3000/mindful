import { useEffect, useRef } from 'react';

export function useTextareaAutosize(value: string) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height based on scrollHeight
      textarea.style.height = Math.max(textarea.scrollHeight, 80) + 'px';
    }
  }, [value]);

  return textareaRef;
} 