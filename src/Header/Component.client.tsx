'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Home, FolderGit2, GraduationCap, Briefcase, NotebookPen } from 'lucide-react'

const NAV_ICONS: Record<string, React.ElementType> = {
  home: Home,
  projects: FolderGit2,
  education: GraduationCap,
  experience: Briefcase,
  posts: NotebookPen,
}

function getNavIcon(label: string): React.ElementType | null {
  const key = label.toLowerCase().trim()
  return NAV_ICONS[key] ?? null
}

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const navItems = data?.navItems || []

  const links = [
    { href: '/', label: 'Home', icon: Home },
    ...navItems.map(({ link }) => {
      const href =
        link.type === 'reference' &&
        typeof link.reference?.value === 'object' &&
        link.reference.value.slug
          ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
          : link.url || '/'

      return {
        href,
        label: link.label || '',
        icon: getNavIcon(link.label || ''),
      }
    }),
  ]

  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 rounded-full border border-primary/20 bg-background/80 backdrop-blur-xl shadow-lg shadow-primary/5"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href

        return (
          <Link
            key={href}
            href={href}
            className={`relative group flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
            }`}
            aria-label={label}
          >
            {Icon ? (
              <Icon className="w-4 h-4" />
            ) : (
              <span className="text-xs font-medium">{label.slice(0, 2)}</span>
            )}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-medium bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {label}
            </span>
          </Link>
        )
      })}
      <div className="w-px h-5 bg-border/50 mx-1" />
      <ThemeSelector />
    </nav>
  )
}
