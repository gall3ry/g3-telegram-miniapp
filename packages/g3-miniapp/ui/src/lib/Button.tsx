import { cn } from '@g3-miniapp/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Spinner } from './Spinner';

const buttonVariants = cva(
  'rounded-lg justify-center items-center gap-1.5 inline-flex text-[#171B36] text-base font-bold leading-normal',
  {
    variants: {
      variant: {
        primary: 'bg-[#22F573] hover:bg-[#06B94B]',
        secondary: 'bg-[#E5E7EC] hover:bg-[#BEC3D1]',
        outline:
          'bg-white rounded-[32px] border border-slate-300 hover:bg-[#F2F6F9]',
      },
      size: {
        small: 'h-8 px-2 py-1 text-base font-bold leading-normal',
        medium: 'h-10 px-3 py-2 text-base font-bold leading-normal',
        big: 'h-12 px-4 py-2.5 text-xl font-bold leading-7',
      },
      isDisabled: {
        true: '',
        false: '',
      },
      isLoading: {
        true: 'bg-[#F2F6F9] hover:bg-[#F2F6F9] text-[#BEC3D1] cursor-not-allowed',
      },
      rounded: {
        small: 'rounded-[8px]',
        medium: 'rounded-[16px]',
        big: 'rounded-[32px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
    compoundVariants: [
      {
        variant: 'primary',
        isDisabled: true,
        className: 'bg-[#F2F6F9] text-[#BEC3D1] pointer-events-none',
      },
      {
        variant: 'secondary',
        isDisabled: true,
        className: 'bg-[#F2F6F9] text-[#BEC3D1] pointer-events-none',
      },
    ],
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      children,
      rounded,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
            rounded,
            isDisabled: props.disabled,
            isLoading,
          })
        )}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <div className="size-5 flex items-center mr-1.5">
            <Spinner size={size} />
          </div>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
