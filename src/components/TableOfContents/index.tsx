'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'
import { AlignLeft } from 'lucide-react'
import type { TOCHeading } from '@/utilities/extractHeadings'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

function useActiveHeading(headings: TOCHeading[]) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const headingElementsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map())

  useEffect(() => {
    if (headings.length === 0) return

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        headingElementsRef.current.set(entry.target.id, entry)
      })

      const visibleHeadings: IntersectionObserverEntry[] = []
      headingElementsRef.current.forEach((entry) => {
        if (entry.isIntersecting) visibleHeadings.push(entry)
      })

      if (visibleHeadings.length > 0) {
        const sorted = visibleHeadings.sort(
          (a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top,
        )
        setActiveId(sorted[0].target.id)
      }
    }

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px -60% 0px',
    })

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [headings])

  return activeId
}

function TOCList({
  headings,
  activeId,
  onNavigate,
}: {
  headings: TOCHeading[]
  activeId: string
  onNavigate?: () => void
}) {
  const minLevel = Math.min(...headings.map((h) => h.level))

  return (
    <ul className="space-y-1 text-sm border-l border-border">
      {headings.map((heading) => {
        const indent = heading.level - minLevel
        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(heading.id)
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' })
                  window.history.replaceState(null, '', `#${heading.id}`)
                }
                onNavigate?.()
              }}
              className={cn(
                'block py-1 transition-colors leading-snug',
                indent === 0 && 'pl-3',
                indent === 1 && 'pl-6',
                indent >= 2 && 'pl-9',
                activeId === heading.id
                  ? 'text-primary border-l-2 border-primary -ml-px font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {heading.text}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function TableOfContents({ headings }: { headings: TOCHeading[] }) {
  const activeId = useActiveHeading(headings)
  const [open, setOpen] = useState(false)

  const handleNavigate = useCallback(() => {
    setOpen(false)
  }, [])

  if (headings.length === 0) return null

  return (
    <>
      {/* Desktop: inline sticky sidebar */}
      <nav className="hidden xl:block h-full">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <p className="text-sm font-medium mb-3">On this page</p>
          <TOCList headings={headings} activeId={activeId} />
        </div>
      </nav>

      {/* Mobile/Tablet: bookmark tab + sheet */}
      <div className="xl:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="fixed right-0 top-1/3 z-40 flex items-center gap-1.5 rounded-l-lg border border-r-0 border-border bg-background/90 backdrop-blur-sm px-2 py-2.5 shadow-md transition-colors hover:bg-accent"
              aria-label="Table of contents"
            >
              <AlignLeft className="size-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 sm:w-80 overflow-y-auto">
            <SheetTitle className="text-sm font-medium mb-4">On this page</SheetTitle>
            <TOCList headings={headings} activeId={activeId} onNavigate={handleNavigate} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
