import React from 'react';

export function Switch({ id, checked, onCheckedChange, defaultChecked }: { id?: string; checked?: boolean; onCheckedChange?: (checked: boolean) => void; defaultChecked?: boolean }) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
  
  const isChecked = checked !== undefined ? checked : internalChecked;

  const toggle = () => {
    const newValue = !isChecked;
    setInternalChecked(newValue);
    if (onCheckedChange) onCheckedChange(newValue);
  };

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isChecked}
      onClick={toggle}
      className={`peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${
        isChecked ? 'bg-orange-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
