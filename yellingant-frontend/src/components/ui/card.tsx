import React from 'react';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm max-w-full box-border ${className || ''}`}>{children}</div>;
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-6 pb-4 ${className || ''}`}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={`text-sm text-gray-500 mt-2 ${className || ''}`}>{children}</p>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-6 pt-0 ${className || ''}`}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex items-center p-6 pt-0 ${className || ''}`}>{children}</div>;
}
