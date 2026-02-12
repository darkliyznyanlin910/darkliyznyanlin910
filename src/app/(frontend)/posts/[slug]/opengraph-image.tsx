import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'
import type { Media, SiteSetting } from '@/payload-types'

export const runtime = 'nodejs'
export const alt = 'Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 60

export default async function Image({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug)
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    limit: 1,
    pagination: false,
    where: { slug: { equals: decodedSlug } },
    select: {
      title: true,
      heroImage: true,
      categories: true,
      publishedAt: true,
      meta: true,
    },
  })

  const post = result.docs?.[0]

  const siteSettings: SiteSetting = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  const profileImage =
    siteSettings.profileImage && typeof siteSettings.profileImage === 'object'
      ? (siteSettings.profileImage as Media)
      : null

  const profileImageUrl = profileImage?.url
    ? profileImage.url.startsWith('http')
      ? profileImage.url
      : `${getServerSideURL()}${profileImage.url}`
    : null

  const title = post?.title || 'Untitled Post'
  const fullName = siteSettings.fullName || 'Johnny Lin'

  const categories =
    post?.categories
      ?.map((cat) => (typeof cat === 'object' ? cat.title : null))
      .filter(Boolean) ?? []

  const publishedDate = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // Check if there's a hero image to use as background
  const heroImage =
    post?.heroImage && typeof post.heroImage === 'object' ? (post.heroImage as Media) : null
  const heroImageUrl = heroImage?.url
    ? heroImage.url.startsWith('http')
      ? heroImage.url
      : `${getServerSideURL()}${heroImage.url}`
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Hero image as faded background */}
        {heroImageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.15,
              }}
            />
          </div>
        )}

        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Blue radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '10%',
            width: '60%',
            height: '80%',
            display: 'flex',
            background:
              'radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Purple corner glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '50%',
            height: '60%',
            display: 'flex',
            background:
              'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Outer border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        />

        {/* Inner border */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            display: 'flex',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
          }}
        />

        {/* Corner marks - top left */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 20,
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 1,
            height: 20,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />
        {/* Corner marks - top right */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            width: 20,
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            width: 1,
            height: 20,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />
        {/* Corner marks - bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            width: 20,
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            width: 1,
            height: 20,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />
        {/* Corner marks - bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 20,
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: 1,
            height: 20,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            zIndex: 1,
            height: '100%',
          }}
        >
          {/* Top section: categories + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {categories.length > 0 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {categories.slice(0, 3).map((cat) => (
                  <div
                    key={cat}
                    style={{
                      fontSize: 14,
                      color: '#93c5fd',
                      background: 'rgba(59,130,246,0.12)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      borderRadius: 6,
                      padding: '4px 12px',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      display: 'flex',
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
            {publishedDate && (
              <div
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 0.5,
                  display: 'flex',
                }}
              >
                {publishedDate}
              </div>
            )}
          </div>

          {/* Middle section: title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontSize: title.length > 60 ? 40 : title.length > 40 ? 48 : 56,
                fontWeight: 700,
                color: 'white',
                letterSpacing: -1.5,
                lineHeight: 1.15,
                display: 'flex',
                maxWidth: '90%',
              }}
            >
              {title}
            </div>

            {/* Accent line */}
            <div
              style={{
                width: 80,
                height: 3,
                borderRadius: 2,
                display: 'flex',
                background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
              }}
            />
          </div>

          {/* Bottom section: author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {profileImageUrl ? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImageUrl}
                  alt=""
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                JL
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'white', display: 'flex' }}>
                {fullName}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: 'monospace',
                  display: 'flex',
                }}
              >
                johnnyknl.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom vignette */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            display: 'flex',
            background: 'linear-gradient(transparent, rgba(10,10,10,0.6))',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
