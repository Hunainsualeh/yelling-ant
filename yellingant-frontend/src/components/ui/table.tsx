import React from 'react';

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className || ''}`}>{children}</table>
    </div>
  );
}

export function TableHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <thead className={`[&_tr]:border-b ${className || ''}`}>{children}</thead>;
}

export function TableBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`}>{children}</tbody>;
}

export function TableRow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <tr className={`border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 ${className || ''}`}>
      {children}
    </tr>
  );
}

export function TableHead({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className || ''}`}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, colSpan }: { className?: string; children?: React.ReactNode; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`}>
      {children}
    </td>
  );
}
