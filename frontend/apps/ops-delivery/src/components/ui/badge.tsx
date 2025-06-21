import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-gray-900",
    destructive: "bg-red-600 text-white",
    outline: "border border-gray-300 text-gray-700"
  };
  
  const classes = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`;
  
  return (
    <div className={classes} {...props} />
  )
}