'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Menu, X } from 'lucide-react'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const navItems = data?.navItems || []

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl"
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Johnny Lin
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ link }, i) => {
              const href =
                link.type === 'reference' &&
                typeof link.reference?.value === 'object' &&
                link.reference.value.slug
                  ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
                  : link.url

              const isActive = href && pathname === href

              return (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="link"
                  className={
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground transition-colors'
                  }
                />
              )
            })}
            <ThemeSelector />
          </nav>

          {/* Mobile: theme + menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSelector />
            <button
              onClick={() => setOpen(true)}
              className="p-2 text-foreground"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        className={`fixed inset-0 z-100 bg-background transition-all duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <span className="text-sm text-muted-foreground">Navigation</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-foreground"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="container flex flex-col gap-1 mt-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`text-2xl font-medium py-3 border-b border-border/40 transition-colors ${
              pathname === '/' ? 'text-primary' : 'text-foreground'
            }`}
          >
            Home
          </Link>
          {navItems.map(({ link }, i) => {
            const href =
              link.type === 'reference' &&
              typeof link.reference?.value === 'object' &&
              link.reference.value.slug
                ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
                : link.url

            const isActive = href && pathname === href

            return (
              <Link
                key={i}
                href={href || '/'}
                onClick={() => setOpen(false)}
                className={`text-2xl font-medium py-3 border-b border-border/40 transition-colors ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
