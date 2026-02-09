import type { Project, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { FolderGit2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'
import React from 'react'

interface ProjectsCardProps {
  projects: Project[]
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FolderGit2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Projects</h2>
      </div>

      {/* Projects list */}
      <div className="flex flex-col gap-4">
        {projects.map((project) => {
          const media =
            typeof project.image === 'object' && project.image !== null
              ? (project.image as Media)
              : null
          const imageUrl = media?.url ? getMediaUrl(media.url) : null

          const content = (
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={media?.alt || project.title}
                    width={24}
                    height={24}
                    className="object-contain rounded-full"
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{project.title}</p>
                {project.description && (
                  <RichText
                    data={project.description}
                    enableGutter={false}
                    enableProse={false}
                    className="text-xs text-muted-foreground line-clamp-1 [&_p]:m-0"
                  />
                )}
              </div>
            </div>
          )

          return (
            <Link
              key={project.id}
              href={project.link || '/projects'}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noopener noreferrer' : undefined}
              className="hover:opacity-80 transition-opacity"
            >
              {content}
            </Link>
          )
        })}
      </div>

      {/* View all link */}
      <Link
        href="/projects"
        className="block mt-6 text-center text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        View all &rarr;
      </Link>
    </div>
  )
}
