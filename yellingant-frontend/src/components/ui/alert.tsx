import React from 'react';

export function Alert({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div role="alert" className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950 ${className || ''}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className || ''}`}>
      {children}
    </h5>
  );
}

export function AlertDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className || ''}`}>
      {children}
    </div>
  );
}
