import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  padding = 'md',
  hover = false 
}: GlassCardProps) {
  const baseClasses = "backdrop-blur-lg border border-white/20 rounded-xl";
  
  const variantClasses = {
    default: "bg-white/80",
    strong: "bg-white/90 shadow-lg",
    subtle: "bg-white/60"
  };
  
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };
  
  const hoverClasses = hover ? "transition-all duration-200 hover:bg-white/90 hover:shadow-lg hover:scale-[1.02]" : "";
  
  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
}