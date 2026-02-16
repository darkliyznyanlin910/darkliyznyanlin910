import type { Metadata } from 'next/types'

import { BlogEntry } from '@/components/BlogEntry'
import { CategoryPill } from '@/components/CategoryPill'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NotebookPen } from 'lucide-react'
import React from 'react'
import PageClient from './page.client'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

export const revalidate = 60

type Args = {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { category: categorySlug } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    overrideAccess: false,
    sort: 'title',
    select: {
      title: true,
      slug: true,
    },
  })

  const where = categorySlug
    ? {
        'categories.slug': {
          equals: categorySlug,
        },
      }
    : undefined

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
    where,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
  })

  const activeCategory = categories.docs.find((c) => c.slug === categorySlug)

  return (
    <main className="flex-1">
      <PageClient />
      <div className="container pt-16 pb-24 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Posts</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Articles, thoughts, and things I&apos;ve learned along the way.
        </p>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          <Link
            href="/posts"
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
              !categorySlug
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary',
            )}
          >
            All
          </Link>
          {categories.docs.map((cat) => (
            <CategoryPill
              key={cat.id}
              title={cat.title}
              slug={cat.slug}
              isActive={cat.slug === categorySlug}
            />
          ))}
        </div>

        {posts.docs.length > 0 ? (
          <>
            <PageRange
              className="text-muted-foreground mb-12"
              collection="posts"
              currentPage={posts.page}
              limit={12}
              totalDocs={posts.totalDocs}
            />

            <div className="flex flex-col gap-10 max-w-2xl">
              {posts.docs.map((post) => (
                <BlogEntry
                  key={post.id}
                  title={post.title}
                  slug={post.slug || ''}
                  description={post.meta?.description || null}
                  publishedAt={post.publishedAt || null}
                  categories={
                    post.categories
                      ?.filter((c) => typeof c === 'object' && c !== null)
                      .map((c) => ({ title: (c as any).title, slug: (c as any).slug })) ?? []
                  }
                />
              ))}
            </div>

            {posts.totalPages > 1 && posts.page && (
              <div className="mt-12">
                <Pagination
                  page={posts.page}
                  totalPages={posts.totalPages}
                  categorySlug={categorySlug}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <NotebookPen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">
              {activeCategory ? `No posts in "${activeCategory.title}"` : 'No posts yet'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeCategory
                ? 'Try selecting a different category.'
                : 'New articles and thoughts will appear here. Stay tuned!'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Posts | Johnny Lin`,
  }
}
