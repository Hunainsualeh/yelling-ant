import React, { createContext, useContext } from 'react';
import { X } from 'lucide-react';

const DialogContext = createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

export function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  return (
    <DialogContext.Provider value={{ open: !!open, onOpenChange: onOpenChange || (() => {}) }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const context = useContext(DialogContext);
  if (!context) return null;
  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0" onClick={() => context.onOpenChange(false)} />
      <div className={`fixed z-50 grid w-full gap-4 rounded-b-lg border bg-white p-6 shadow-lg animate-in slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-95 duration-200 ${className || ''}`}>
        {children}
        <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500"
            onClick={() => context.onOpenChange(false)}
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={`text-sm text-gray-500 ${className || ''}`}>
      {children}
    </p>
  );
}
