import type { Metadata } from 'next'
import type { SiteSetting, Media } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { BlogEntry } from '@/components/BlogEntry'
import { WorkCard } from '@/components/WorkCard'
import React from 'react'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch site settings
  const siteSettings: SiteSetting = await getCachedGlobal('site-settings', 1)()

  // Fetch latest posts
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 4,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      meta: true,
      publishedAt: true,
    },
  })

  // Fetch experience entries
  const experience = await payload.find({
    collection: 'experience',
    depth: 1,
    limit: 10,
    sort: 'order',
  })

  const profileImage =
    siteSettings.profileImage && typeof siteSettings.profileImage === 'object'
      ? (siteSettings.profileImage as Media)
      : null
  const profileImageUrl = profileImage?.url ? getMediaUrl(profileImage.url) : null

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-2xl">
          {/* Avatar */}
          {profileImageUrl && (
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50">
                <Image
                  src={profileImageUrl}
                  alt={siteSettings.fullName || 'Profile'}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Hello, I&apos;m <span className="text-primary">{siteSettings.name || 'Johnny'}</span>.
          </h1>

          {/* Subtitle */}
          {siteSettings.subtitle && (
            <p className="mt-4 text-lg md:text-xl text-foreground/80 font-medium">
              {siteSettings.subtitle}
            </p>
          )}

          {/* Bio */}
          {siteSettings.bio && (
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl">
              {siteSettings.bio}
            </p>
          )}

          {/* Social icons */}
          <div className="flex items-center gap-4 mt-6">
            {siteSettings.githubUrl && (
              <Link
                href={siteSettings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            )}
            {siteSettings.linkedinUrl && (
              <Link
                href={siteSettings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            )}
            {siteSettings.emailAddress && (
              <Link
                href={`mailto:${siteSettings.emailAddress}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Content: Blog posts + Work card */}
      <section className="container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left: Recent blog posts */}
          <div className="lg:col-span-2">
            {posts.docs.length > 0 && (
              <div className="flex flex-col gap-10">
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
            )}

            {posts.docs.length === 0 && (
              <p className="text-muted-foreground">No posts yet. Check back soon.</p>
            )}
          </div>

          {/* Right: Work card (sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <WorkCard
                experiences={experience.docs}
                resumeUrl={siteSettings.resumeUrl}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: "Johnny Lin's Portfolio",
    description:
      'Welcome to my portfolio website! Explore my projects, experience, and blog posts.',
    metadataBase: new URL(getServerSideURL()),
  }
}
