import Link from 'next/link'
import { cn } from '@/utilities/ui'

interface CategoryPillProps {
  title: string
  slug: string
  isActive?: boolean
}

export function CategoryPill({ title, slug, isActive }: CategoryPillProps) {
  return (
    <Link
      href={`/posts?category=${slug}`}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary',
      )}
    >
      {title}
    </Link>
  )
}
