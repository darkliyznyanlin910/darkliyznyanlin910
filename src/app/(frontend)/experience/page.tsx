import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Timeline, type TimelineItem } from '@/components/Timeline'
import React from 'react'

export const revalidate = 60

export default async function ExperiencePage() {
  const payload = await getPayload({ config: configPromise })

  const experience = await payload.find({
    collection: 'experience',
    depth: 1,
    limit: 50,
    sort: 'order',
  })

  const timelineItems: TimelineItem[] = experience.docs.map((exp) => ({
    id: exp.id,
    title: exp.title,
    subtitle: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    links: exp.links?.map((l) => ({ label: l.label, customLabel: l.customLabel, url: l.url })) ?? null,
    logo: exp.logo,
    description: exp.description,
  }))

  return (
    <main className="flex-1">
      <div className="container pt-16 pb-24 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Experience</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Here are the companies and roles I have worked at.
        </p>

        <div className="max-w-3xl">
          <Timeline items={timelineItems} />

          {experience.docs.length === 0 && (
            <p className="text-muted-foreground">No experience entries yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: "Experience | Johnny Lin's Portfolio",
    description: 'Here are the companies and roles I have worked at.',
  }
}
