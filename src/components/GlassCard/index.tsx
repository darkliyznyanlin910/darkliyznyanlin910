import { cn } from '@/utilities/ui'
import React from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
