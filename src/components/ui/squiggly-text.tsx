'use client';

import { useEffect, useId, useRef } from 'react';
import type { CSSProperties } from 'react';

interface SquigglyTextProps {
  children: React.ReactNode;
  steps?: number;
  stepDuration?: number;
  scale?: number | [number, number];
  baseFrequency?: number;
  numOctaves?: number;
  as?: 'span' | 'div';
  className?: string;
  style?: CSSProperties;
}

export function SquigglyText({
  children,
  steps = 5,
  stepDuration = 80,
  scale = [6, 8],
  baseFrequency = 0.02,
  numOctaves = 3,
  as: Tag = 'span',
  className,
  style,
}: SquigglyTextProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const filterId = `sq-${uid}`;
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % steps;
      const s = stepRef.current;
      const scaleValue = Array.isArray(scale) ? scale[s % scale.length] : scale;
      turbRef.current?.setAttribute('seed', String(s));
      dispRef.current?.setAttribute('scale', String(scaleValue));
    }, stepDuration);
    return () => clearInterval(interval);
  }, [steps, stepDuration, scale]);

  return (
    <Tag className={className} style={{ ...style, filter: `url(#${filterId})` }}>
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', overflow: 'hidden' }}
        aria-hidden
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency={baseFrequency}
              numOctaves={numOctaves}
              seed={0}
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale={Array.isArray(scale) ? scale[0] : scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </Tag>
  );
}
