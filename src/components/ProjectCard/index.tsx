import type { Project, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'
import React from 'react'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, image, link } = project
  const media = typeof image === 'object' && image !== null ? (image as Media) : null
  const imageUrl = media?.url ? getMediaUrl(media.url) : null

  const cardClassName =
    'group block rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/50 hover:bg-card/80'

  const inner = (
    <div className="flex flex-col md:flex-row">
      {imageUrl && (
        <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
          <Image src={imageUrl} alt={media?.alt || title} fill className="object-cover" />
        </div>
      )}
      <div className="p-6 flex flex-col gap-2">
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <RichText
            data={description}
            enableGutter={false}
            enableProse={true}
            className="text-sm text-muted-foreground prose-sm"
          />
        )}
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} target="_blank" rel="noopener noreferrer" className={cardClassName}>
        {inner}
      </Link>
    )
  }

  return <div className={cardClassName}>{inner}</div>
}
