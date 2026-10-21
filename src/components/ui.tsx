import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export function ProgressBar({ value, label, tone = 'accent', size = 'md' }: { value: number; label: string; tone?: 'accent' | 'good' | 'warn'; size?: 'sm' | 'md' }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`pbar pbar-${size} pbar-${tone}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}>
      <div className="pbar-fill" style={{ width: `${v}%` }} />
    </div>
  );
}

export function Callout({ kind, title, icon, children }: { kind: 'tip' | 'warn' | 'info' | 'example' | 'analogy' | 'ref'; title: string; icon: IconName; children: ReactNode }) {
  return (
    <div role="note" aria-label={title} className={`callout callout-${kind}`}>
      <div className="callout-title">
        <Icon name={icon} size={18} />
        <span>{title}</span>
      </div>
      <div className="callout-body">{children}</div>
    </div>
  );
}

/** Click-to-expand section. `forceOpen` lets a parent expand/collapse all (counter changes re-sync state). */
export function Accordion({ title, children, defaultOpen = false, syncKey, syncOpen, icon, level = 3 }: { level?: 3 | 4; title: ReactNode; children: ReactNode; defaultOpen?: boolean; syncKey?: number; syncOpen?: boolean; icon?: IconName }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  useEffect(() => {
    if (syncKey !== undefined && syncKey > 0 && syncOpen !== undefined) setOpen(syncOpen);
  }, [syncKey, syncOpen]);
  return (
    <div className={`accordion${open ? ' is-open' : ''}`}>
      <div role="heading" aria-level={level} className="accordion-head">
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          {icon && <Icon name={icon} size={18} />}
          <span>{title}</span>
          <Icon name="chevronDown" size={18} className="chev" />
        </button>
      </div>
      <div id={id} role="region" aria-labelledby={`${id}-btn`} hidden={!open} className="accordion-body">
        {children}
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const root = ref.current;
    root?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
      if (e.key === 'Tab' && root) {
        const f = [...root.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])')];
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      prev?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`modal${wide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close dialog" data-autofocus>
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: { title: string; message: ReactNode; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="stack">
        <div>{message}</div>
        <div className="row end">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </header>
  );
}
