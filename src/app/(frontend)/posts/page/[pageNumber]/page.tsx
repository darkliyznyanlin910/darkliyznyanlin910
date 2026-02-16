import type { Metadata } from 'next/types'

import { BlogEntry } from '@/components/BlogEntry'
import { CategoryPill } from '@/components/CategoryPill'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

export const revalidate = 60

type Args = {
  params: Promise<{
    pageNumber: string
  }>
  searchParams: Promise<{
    category?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const { category: categorySlug } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

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
    page: sanitizedPageNumber,
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

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Posts</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Articles, thoughts, and things I&apos;ve learned along the way.
        </p>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <div className="container">
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
      </div>

      <div className="container mt-12">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} categorySlug={categorySlug} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Posts — Page ${pageNumber || ''} | Johnny Lin`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
