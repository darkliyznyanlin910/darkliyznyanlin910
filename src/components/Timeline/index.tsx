import type { Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'

export interface TimelineItem {
  id: number
  title: string
  subtitle: string
  startDate: string
  endDate?: string | null
  link?: string | null
  logo?: (number | null) | Media
  description?: DefaultTypedEditorState | null
}

interface TimelineProps {
  items: TimelineItem[]
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

      <div className="flex flex-col gap-12">
        {items.map((item) => {
          const media =
            typeof item.logo === 'object' && item.logo !== null ? (item.logo as Media) : null
          const logoUrl = media?.url ? getMediaUrl(media.url) : null

          return (
            <div key={item.id} className="relative pl-16">
              {/* Logo or dot */}
              <div className="absolute left-0 top-0 w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={item.subtitle}
                    width={40}
                    height={40}
                    className="object-contain rounded-full"
                  />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  {item.link ? (
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  )}
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {item.startDate} &mdash; {item.endDate || 'Present'}
                  </span>
                </div>

                <p className="text-muted-foreground">{item.subtitle}</p>

                {item.description && (
                  <div className="mt-3">
                    <RichText
                      data={item.description}
                      enableGutter={false}
                      enableProse={true}
                      className="prose-sm text-muted-foreground"
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
