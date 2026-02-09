import type { Metadata } from 'next/types'

import { BlogEntry } from '@/components/BlogEntry'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NotebookPen } from 'lucide-react'
import React from 'react'
import PageClient from './page.client'

export const revalidate = 60

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      meta: true,
      publishedAt: true,
    },
  })

  return (
    <main className="flex-1">
      <PageClient />
      <div className="container pt-16 pb-24 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Posts</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Articles, thoughts, and things I&apos;ve learned along the way.
        </p>

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
                />
              ))}
            </div>

            {posts.totalPages > 1 && posts.page && (
              <div className="mt-12">
                <Pagination page={posts.page} totalPages={posts.totalPages} />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <NotebookPen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No posts yet</h2>
            <p className="text-sm text-muted-foreground">
              New articles and thoughts will appear here. Stay tuned!
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
