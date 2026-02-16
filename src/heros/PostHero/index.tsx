import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import Link from 'next/link'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const hasHeroImage = heroImage && typeof heroImage !== 'string'

  const resolvedCategories = categories?.filter(
    (c): c is Exclude<typeof c, number> => typeof c === 'object' && c !== null,
  )

  const categoryPills = resolvedCategories?.map((category) => (
    <Link
      key={category.id}
      href={`/posts?category=${category.slug}`}
      className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {category.title || 'Untitled category'}
    </Link>
  ))

  if (!hasHeroImage) {
    return (
      <div className="container pt-16 pb-8">
        {categoryPills && categoryPills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">{categoryPills}</div>
        )}
        <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
        <div className="flex flex-col md:flex-row gap-4 md:gap-16 text-muted-foreground">
          {hasAuthors && (
            <div className="flex flex-col gap-1">
              <p className="text-sm">Author</p>
              <p>{formatAuthors(populatedAuthors)}</p>
            </div>
          )}
          {publishedAt && (
            <div className="flex flex-col gap-1">
              <p className="text-sm">Date Published</p>
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {resolvedCategories && resolvedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {resolvedCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/posts?category=${category.slug}`}
                  className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium transition-colors hover:bg-white/30"
                >
                  {category.title || 'Untitled category'}
                </Link>
              ))}
            </div>
          )}

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-linear-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
