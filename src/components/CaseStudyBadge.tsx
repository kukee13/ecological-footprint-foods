'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaseStudyBadgeProps {
  slug: string;
  label?: string;
  variant?: 'card' | 'inline';
  className?: string;
}

export default function CaseStudyBadge({
  slug,
  label = 'Fallstudie verfügbar',
  variant = 'card',
  className,
}: CaseStudyBadgeProps) {
  const href = `/fallstudie/${slug}`;

  if (variant === 'inline') {
    return (
      <Link
        href={href}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-burgundy hover:underline',
          className,
        )}
      >
        {label}
        <ArrowRight size={12} />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'group/badge absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-burgundy text-white shadow-md hover:bg-charcoal transition-colors',
        className,
      )}
    >
      <BookOpen size={11} />
      <span className="text-[9px] font-black uppercase tracking-[0.18em]">{label}</span>
      <ArrowRight size={11} className="group-hover/badge:translate-x-0.5 transition-transform" />
    </Link>
  );
}
