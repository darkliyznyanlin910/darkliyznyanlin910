import type { Project, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { LinkIcon, getLinkLabel } from '@/components/LinkIcon'
import React from 'react'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, image, links, startDate, endDate } = project
  const media = typeof image === 'object' && image !== null ? (image as Media) : null
  const imageUrl = media?.url ? getMediaUrl(media.url) : null

  const cardClassName =
    'group rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/50 hover:bg-card/80'

  return (
    <div className={cardClassName}>
      <div className="flex flex-col md:flex-row">
        {imageUrl && (
          <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
            <Image src={imageUrl} alt={media?.alt || title} fill className="object-cover" />
          </div>
        )}
        <div className="p-6 flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {startDate && (
            <span className="text-sm text-muted-foreground">
              {startDate} &mdash; {endDate || 'Present'}
            </span>
          )}
          {description && (
            <RichText
              data={description}
              enableGutter={false}
              enableProse={true}
              className="text-sm text-muted-foreground prose-sm"
            />
          )}
          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  <LinkIcon label={link.label} className="w-3 h-3" />
                  {getLinkLabel(link.label, link.customLabel)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
