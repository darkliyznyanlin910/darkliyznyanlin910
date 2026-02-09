import type { Post, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface BlogCardProps {
  post: Post
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const { title, slug, meta, publishedAt, categories } = post
  const image =
    meta?.image && typeof meta.image === 'object' ? (meta.image as Media) : null
  const imageUrl = image?.url ? getMediaUrl(image.url) : null
  const description = meta?.description || null

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <Link
      href={`/posts/${slug}`}
      className="group block rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/50 hover:bg-card/80"
    >
      {imageUrl && (
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={imageUrl}
            alt={image?.alt || title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-2">
        {formattedDate && (
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        )}
        <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        {categories && Array.isArray(categories) && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {categories.map((cat) => {
              const category = typeof cat === 'object' ? cat : null
              if (!category) return null
              return (
                <span
                  key={category.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                >
                  {category.title}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </Link>
  )
}
