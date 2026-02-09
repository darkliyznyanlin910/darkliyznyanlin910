import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProjectCard } from '@/components/ProjectCard'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ProjectsPage() {
  const payload = await getPayload({ config: configPromise })

  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 50,
    sort: 'order',
  })

  return (
    <main className="flex-1">
      <div className="container pt-16 pb-24 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Here are some of the projects I have worked on.
        </p>

        <div className="flex flex-col gap-6">
          {projects.docs.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

          {projects.docs.length === 0 && (
            <p className="text-muted-foreground">No projects yet. Check back soon.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: "Projects | Johnny Lin's Portfolio",
    description: 'Here are some of the projects I have worked on.',
  }
}
