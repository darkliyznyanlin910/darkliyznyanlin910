import type { Experience, Media } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { Briefcase } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface WorkCardProps {
  experiences: Experience[]
}

export const WorkCard: React.FC<WorkCardProps> = ({ experiences }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Experience</h2>
      </div>

      {/* Experience list */}
      <div className="flex flex-col gap-4">
        {experiences.map((exp) => {
          const media =
            typeof exp.logo === 'object' && exp.logo !== null ? (exp.logo as Media) : null
          const logoUrl = media?.url ? getMediaUrl(media.url) : null

          return (
            <div key={exp.id} className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center overflow-hidden shrink-0">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={exp.company}
                    width={24}
                    height={24}
                    className="object-contain rounded-full"
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>

              {/* Info + Date */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0 sm:gap-2">
                  <p className="text-sm font-medium truncate">{exp.company}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {exp.startDate} &mdash; {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{exp.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Link
        href="/experience"
        className="block mt-6 text-center text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        View in detail &rarr;
      </Link>
    </div>
  )
}
