import type { Metadata } from 'next'
import type { SiteSetting, Media } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getServerSideURL } from '@/utilities/getURL'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin, Mail, FileText, NotebookPen } from 'lucide-react'
import { BlogEntry } from '@/components/BlogEntry'
import { WorkCard } from '@/components/WorkCard'
import { ProjectsCard } from '@/components/ProjectsCard'
import RichText from '@/components/RichText'
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

  // Fetch projects
  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 6,
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
        {/* Heading + Avatar row */}
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Hello, I&apos;m <span className="text-primary">{siteSettings.name || 'Johnny'}</span>.
          </h1>

          {/* Avatar */}
          {profileImageUrl && (
            <div className="shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-primary/50">
                <Image
                  src={profileImageUrl}
                  alt={siteSettings.fullName || 'Profile'}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Subtitle */}
        {siteSettings.subtitle && (
          <p className="mt-4 text-lg md:text-xl text-foreground/80 font-medium">
            {siteSettings.subtitle}
          </p>
        )}

        {/* Bio */}
        {siteSettings.bio && (
          <div className="mt-4 max-w-xl">
            <RichText
              data={siteSettings.bio}
              enableGutter={false}
              className="text-base text-muted-foreground leading-relaxed [&_p]:m-0"
            />
          </div>
        )}

        {/* Social icons + View CV */}
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
          {siteSettings.resumeUrl && (
            <Link
              href={siteSettings.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </Link>
          )}
        </div>
      </section>

      {/* Experience */}
      {experience.docs.length > 0 && (
        <section className="container pb-12">
          <WorkCard experiences={experience.docs} />
        </section>
      )}

      {/* Projects */}
      {projects.docs.length > 0 && (
        <section className="container pb-12">
          <ProjectsCard projects={projects.docs} />
        </section>
      )}

      {/* Posts */}
      <section className="container pb-24">
        {posts.docs.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <NotebookPen className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No posts yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              New articles will appear here soon.
            </p>
          </div>
        )}
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
