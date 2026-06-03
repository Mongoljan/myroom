'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { cn } from '@/lib/utils';

/** Base text color — matches booking form back button */
export const BACK_BUTTON_TEXT_CLASS =
  'shrink-0 text-gray-600 dark:text-gray-300 border-none text-primary-600 text-sm font-bold';

/** Positioning beside the booking stepper */
export const BACK_BUTTON_STEPPER_ANCHOR_CLASS =
  'absolute right-full top-4 -translate-y-1/2 z-10 mr-6';

export interface BackButtonProps {
  onClick?: () => void;
  /** Client navigation target when `onClick` is not provided */
  href?: string;
  label?: React.ReactNode;
  labelKey?: string;
  labelFallback?: string;
  className?: string;
  /** Place to the left of the booking stepper (booking page step 2) */
  stepperAnchor?: boolean;
  disabled?: boolean;
}

export default function BackButton({
  onClick,
  href,
  label,
  labelKey = 'common.back',
  labelFallback,
  className,
  stepperAnchor = false,
  disabled,
}: BackButtonProps) {
  const router = useRouter();
  const { t } = useHydratedTranslation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const text = label ?? (labelFallback !== undefined ? t(labelKey, labelFallback) : t(labelKey));

  return (
    <Button
      variant="ghost"
      size="md"
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        BACK_BUTTON_TEXT_CLASS,
        stepperAnchor && BACK_BUTTON_STEPPER_ANCHOR_CLASS,
        className, 
      )}
    >
      <span className="inline-flex items-center gap-2 leading-none">
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
        <span className="whitespace-nowrap">{text}</span>
      </span>
    </Button>
  );
}
