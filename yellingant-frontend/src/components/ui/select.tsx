import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SelectContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Select({ value, onValueChange, children, defaultValue }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode; defaultValue?: string }) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [open, setOpen] = useState(false);

  const handleValueChange = (val: string) => {
    setInternalValue(val);
    if (onValueChange) onValueChange(val);
    setOpen(false);
  };

  const currentValue = value !== undefined ? value : internalValue;

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  return (
    <button
      type="button"
      id={id}
      onClick={() => context.setOpen(!context.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");
  
  // This is a simplification. Ideally we'd map value to label.
  // For now, we rely on the parent to display the correct thing or just show the value if no label map.
  // But wait, SelectValue usually displays the selected item's text.
  // Without a label map, we can only show the value or placeholder.
  // A proper implementation would register options and their labels.
  
  return <span className="block truncate">{context.value || placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select");

  if (!context.open) return null;

  return (
    <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-80 w-full mt-1">
      <div className="p-1">{children}</div>
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");

  return (
    <div
      onClick={() => context.onValueChange(value)}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100 cursor-pointer ${context.value === value ? 'bg-gray-100' : ''}`}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {context.value === value && (
          <span className="h-2 w-2 rounded-full bg-orange-500" />
        )}
      </span>
      <span className="block truncate">{children}</span>
    </div>
  );
}
