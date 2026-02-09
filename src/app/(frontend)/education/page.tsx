import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Timeline, type TimelineItem } from '@/components/Timeline'
import React from 'react'

export const revalidate = 60

export default async function EducationPage() {
  const payload = await getPayload({ config: configPromise })

  const education = await payload.find({
    collection: 'education',
    depth: 1,
    limit: 50,
    sort: 'order',
  })

  const timelineItems: TimelineItem[] = education.docs.map((edu) => ({
    id: edu.id,
    title: edu.title,
    subtitle: edu.institution,
    startDate: edu.startDate,
    endDate: edu.endDate,
    links: edu.links?.map((l) => ({ label: l.label, customLabel: l.customLabel, url: l.url })) ?? null,
    logo: edu.logo,
    description: edu.description,
  }))

  return (
    <main className="flex-1">
      <div className="container pt-16 pb-24 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Education</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Here are the schools and programs I have attended.
        </p>

        <div className="max-w-3xl">
          <Timeline items={timelineItems} />

          {education.docs.length === 0 && (
            <p className="text-muted-foreground">No education entries yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: "Education | Johnny Lin's Portfolio",
    description: 'Here are the schools and programs I have attended.',
  }
}
