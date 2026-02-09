import Link from 'next/link'
import React from 'react'

interface BlogEntryProps {
  title: string
  slug: string
  description?: string | null
  publishedAt?: string | null
}

export const BlogEntry: React.FC<BlogEntryProps> = ({
  title,
  slug,
  description,
  publishedAt,
}) => {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="group">
      <div className="flex items-start gap-4">
        {/* Accent line + date */}
        <div className="flex items-center gap-3 shrink-0 pt-1">
          <div className="w-0.5 h-4 bg-primary rounded-full" />
          {formattedDate && (
            <span className="text-sm text-muted-foreground whitespace-nowrap">{formattedDate}</span>
          )}
        </div>
      </div>

      <div className="mt-2 ml-[calc(0.125rem+0.75rem)]">
        <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
          <Link href={`/posts/${slug}`}>{title}</Link>
        </h3>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}

        <Link
          href={`/posts/${slug}`}
          className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary hover:underline"
        >
          Read article
          <span aria-hidden="true">&rsaquo;</span>
        </Link>
      </div>
    </article>
  )
}
