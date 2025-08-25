import { forwardRef, InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  // Base input styles
  "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        // Default input styling
        default: "border-gray-300 hover:border-gray-400",
        
        // Success state
        success: "border-green-500 focus-visible:ring-green-500",
        
        // Error state
        error: "border-red-500 focus-visible:ring-red-500",
        
        // Ghost - minimal styling
        ghost: "border-transparent bg-gray-50 hover:bg-gray-100 focus-visible:bg-white focus-visible:border-gray-300",
      },
      inputSize: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-3",
        lg: "h-11 px-4 text-base",
        xl: "h-12 px-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Specialized input components

// Search Input with icon
const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          ref={ref}
          className={cn("pl-10", className)}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

// Password Input with toggle visibility
const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="password"
          className={cn("pr-10", className)}
          {...props}
        />
        {/* Toggle button would go here */}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { Input, SearchInput, PasswordInput, inputVariants };