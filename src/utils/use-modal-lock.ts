import { useEffect, useRef } from 'react';

/**
 * Hook to lock background scrolling and handle Escape key dismissal for modals/drawers.
 * - onClose is kept in a ref so the effect does not re-subscribe on every parent
 *   render (callers typically pass inline arrow functions).
 * - ESC only closes the topmost lock: if several overlays are stacked, a child
 *   modal mounted later wins; parents ignore ESC while a newer lock is active.
 */
const lockStack: symbol[] = [];

export function useModalLock(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const lockIdRef = useRef<Symbol | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const lockId = Symbol('modal-lock');
    lockIdRef.current = lockId;
    lockStack.push(lockId);

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lockStack[lockStack.length - 1] === lockId) {
        e.preventDefault();
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
      const idx = lockStack.indexOf(lockId);
      if (idx >= 0) lockStack.splice(idx, 1);
      lockIdRef.current = null;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);
}
