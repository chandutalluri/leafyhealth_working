import { cn } from '../utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg hover:shadow-brand-400/40 hover:-translate-y-0.5 hover:shadow-xl',
        glass: 'bg-white/20 backdrop-blur-lg border border-white/30 text-gray-800 hover:bg-white/30 shadow-glass',
        'glass-primary': 'bg-brand-500/20 backdrop-blur-lg border border-brand-400/30 text-brand-700 hover:bg-brand-500/30 shadow-green-glow',
        secondary: 'bg-white/80 backdrop-blur-lg text-gray-700 hover:bg-white/90 border border-gray-200/50',
        ghost: 'hover:bg-white/20 backdrop-blur-sm',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-xl',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg rounded-3xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { buttonVariants }