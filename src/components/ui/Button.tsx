import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/styles/containers';

const buttonVariants = cva(
  // Base styles - professional button foundation
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${TYPOGRAPHY.button.standard}`,
  {
    variants: {
      variant: {
        // Primary - main CTAs (book now, search, etc.)
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
        
        // Secondary - alternative actions
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
        
        // Outline - subtle CTAs
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400",
        
        // Ghost - minimal actions
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        
        // Success - positive actions (confirm, save)
        success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
        
        // Warning - caution actions
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
        
        // Destructive - dangerous actions (delete, cancel)
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        
        // Link - text-like appearance
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        // Different sizes for different contexts
        sm: "h-9 px-3",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        xl: "h-12 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };