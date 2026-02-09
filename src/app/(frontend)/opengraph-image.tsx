import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'
import type { SiteSetting, Media } from '@/payload-types'

export const runtime = 'nodejs'
export const alt = 'Johnny Lin'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 60

export default async function Image() {
  const payload = await getPayload({ config: configPromise })
  const siteSettings: SiteSetting = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

  const profileImage =
    siteSettings.profileImage && typeof siteSettings.profileImage === 'object'
      ? (siteSettings.profileImage as Media)
      : null

  const profileImageUrl = profileImage?.url
    ? profileImage.url.startsWith('http')
      ? profileImage.url
      : `${getServerSideURL()}${profileImage.url}`
    : null

  const fullName = siteSettings.fullName || 'Johnny Lin'
  const subtitle = siteSettings.subtitle || 'Software Engineer'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
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
            left: '20%',
            width: '60%',
            height: '80%',
            display: 'flex',
            background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Purple corner glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '50%',
            height: '60%',
            display: 'flex',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)',
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
        <div style={{ position: 'absolute', top: 40, left: 40, width: 20, height: 1, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 40, left: 40, width: 1, height: 20, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
        {/* Corner marks - top right */}
        <div style={{ position: 'absolute', top: 40, right: 40, width: 20, height: 1, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 40, right: 40, width: 1, height: 20, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
        {/* Corner marks - bottom left */}
        <div style={{ position: 'absolute', bottom: 40, left: 40, width: 20, height: 1, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 40, width: 1, height: 20, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
        {/* Corner marks - bottom right */}
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 20, height: 1, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 1, height: 20, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            zIndex: 1,
          }}
        >
          {/* Profile image */}
          {profileImageUrl ? (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 28,
                display: 'flex',
                background: 'rgba(255,255,255,0.05)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profileImageUrl}
                alt=""
                width={96}
                height={96}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 28,
                fontSize: 44,
                fontWeight: 700,
                color: 'white',
                letterSpacing: -2,
              }}
            >
              JL
            </div>
          )}

          {/* Name */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: 'white',
              letterSpacing: -1,
              display: 'flex',
            }}
          >
            {fullName}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: 240,
              height: 3,
              borderRadius: 2,
              marginTop: 20,
              display: 'flex',
              background: 'linear-gradient(90deg, transparent, #3b82f6, #6366f1, transparent)',
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: '#a1a1aa',
              letterSpacing: 3,
              marginTop: 20,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* URL at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            fontSize: 14,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: 1,
            fontFamily: 'monospace',
            display: 'flex',
          }}
        >
          johnnyknl.com
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
