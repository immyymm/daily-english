import { X } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalShellProps extends PropsWithChildren {
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  footer?: ReactNode;
  wide?: boolean;
}

export function ModalShell({ open, title, eyebrow, onClose, footer, children, wide }: ModalShellProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className={wide ? 'modal-sheet wide' : 'modal-sheet'} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2>{title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="关闭"><X size={20} /></button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </section>
    </div>
  );
}
