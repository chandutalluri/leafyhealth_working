import { cn } from '../utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const glassInputVariants = cva(
  'flex w-full backdrop-blur-lg border transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white/20 border-white/30 rounded-2xl px-4 py-3 hover:bg-white/30 focus:bg-white/40',
        search: 'bg-white/60 border-white/40 rounded-full px-6 py-3 hover:bg-white/70 focus:bg-white/80',
        minimal: 'bg-transparent border-gray-300 rounded-lg px-3 py-2 hover:border-brand-400 focus:border-brand-500',
      },
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface GlassInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof glassInputVariants> {}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(glassInputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

GlassInput.displayName = "GlassInput"

export { glassInputVariants }