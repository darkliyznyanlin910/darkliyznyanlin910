import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container py-3 flex justify-between items-center">
        <p className="text-xs text-muted-foreground/70">
          &copy; {new Date().getFullYear()} Johnny Lin
        </p>

        {navItems.length > 0 && (
          <nav className="flex gap-3">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        )}
      </div>
    </footer>
  )
}
