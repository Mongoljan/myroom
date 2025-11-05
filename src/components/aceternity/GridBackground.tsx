'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const GridBackground = ({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        'absolute inset-0 z-0 h-full w-full',
        containerClassName
      )}
    >
      <div
        className={cn(
          'absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]',
          className
        )}
      ></div>
    </div>
  );
};
