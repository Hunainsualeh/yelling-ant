import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Breadcrumb({ children }: { children: React.ReactNode }) {
  return <nav aria-label="breadcrumb">{children}</nav>;
}

export function BreadcrumbList({ children }: { children: React.ReactNode }) {
  return <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500 sm:gap-2.5">{children}</ol>;
}

export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <li className="inline-flex items-center gap-1.5">{children}</li>;
}

export function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link to={href} className="transition-colors hover:text-gray-950">
      {children}
    </Link>
  );
}

export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  return <span role="link" aria-disabled="true" aria-current="page" className="font-normal text-gray-950">{children}</span>;
}

export function BreadcrumbSeparator({ children }: { children?: React.ReactNode }) {
  return (
    <li role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
      {children || <ChevronRight />}
    </li>
  );
}
