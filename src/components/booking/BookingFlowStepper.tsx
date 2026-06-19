'use client';

import { Check } from 'lucide-react';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import type { BookingFlowStep } from '@/utils/bookingFlowNavigation';

function StepLabel({ labelKey }: { labelKey: string }) {
  const { t } = useHydratedTranslation();
  const parts = t(labelKey).split('\n');
  return (
    <>
      {parts[0]}
      {parts[1] ? (
        <>
          <br />
          {parts[1]}
        </>
      ) : null}
    </>
  );
}

interface BookingFlowStepperProps {
  activeStep: BookingFlowStep;
  onStepClick?: (step: BookingFlowStep) => void;
  canGoToStep2?: boolean;
  canGoToStep3?: boolean;
  className?: string;
}

export default function BookingFlowStepper({
  activeStep,
  onStepClick,
  canGoToStep2 = false,
  canGoToStep3 = false,
  className = '',
}: BookingFlowStepperProps) {
  const steps: Array<{
    step: BookingFlowStep;
    labelKey: string;
    clickable: boolean;
  }> = [
    {
      step: 1,
      labelKey: 'bookingFlow.stepRoom',
      clickable: activeStep !== 1 && Boolean(onStepClick),
    },
    {
      step: 2,
      labelKey: 'bookingFlow.stepGuest',
      clickable:
        activeStep !== 2 &&
        Boolean(onStepClick) &&
        (activeStep === 3 || canGoToStep2),
    },
    {
      step: 3,
      labelKey: 'bookingFlow.stepPayment',
      clickable: activeStep === 2 && canGoToStep3 && Boolean(onStepClick),
    },
  ];

  const renderCircle = (step: BookingFlowStep) => {
    const isComplete = step < activeStep;
    const isActive = step === activeStep;

    if (isComplete) {
      return (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
      );
    }

    if (isActive) {
      return (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-sm font-semibold">
          {step}
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center shrink-0 text-sm font-semibold">
        {step}
      </div>
    );
  };

  const connectorClass = (afterStep: BookingFlowStep) =>
    afterStep < activeStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700';

  return (
    <div className={`flex items-start w-full ${className}`}>
      {steps.map((item, index) => (
        <div key={item.step} className="contents">
          <button
            type="button"
            disabled={!item.clickable}
            onClick={() => item.clickable && onStepClick?.(item.step)}
            className={`flex flex-col items-center shrink-0 ${
              item.clickable
                ? 'cursor-pointer group'
                : 'cursor-default'
            }`}
          >
            {renderCircle(item.step)}
            <span
              className={`text-xs font-medium mt-1.5 text-center leading-tight ${
                item.step === activeStep
                  ? 'text-gray-900 dark:text-white'
                  : item.clickable
                    ? 'text-gray-500 dark:text-gray-400 group-hover:text-primary'
                    : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <StepLabel labelKey={item.labelKey} />
            </span>
          </button>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-px mt-4 ${connectorClass(item.step)}`} />
          )}
        </div>
      ))}
    </div>
  );
}
