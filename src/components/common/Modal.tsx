import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${maxWidth} bg-surface rounded-sheet shadow-card overflow-hidden border border-surface-border animate-scale-in max-h-[90vh] flex flex-col text-ink`}
      >
        {title && (
          <div className="px-5 py-3.5 border-b border-surface-border flex items-center justify-between bg-surface-card">
            <h3 className="font-extrabold text-ink text-sm tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-surface border border-surface-border text-ink-muted hover:text-ink flex items-center justify-center active:scale-95 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
