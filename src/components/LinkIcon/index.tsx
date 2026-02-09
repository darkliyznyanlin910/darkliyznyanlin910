import { Github, Linkedin, Globe, ExternalLink, Play } from 'lucide-react'
import React from 'react'

const LABEL_MAP: Record<string, { icon: React.ElementType; display: string }> = {
  github: { icon: Github, display: 'GitHub' },
  demo: { icon: Play, display: 'Demo' },
  linkedin: { icon: Linkedin, display: 'LinkedIn' },
  website: { icon: Globe, display: 'Website' },
}

export function getLinkLabel(label: string, customLabel?: string | null): string {
  if (label === 'other') return customLabel || 'Link'
  return LABEL_MAP[label]?.display ?? label
}

export function LinkIcon({
  label,
  className = 'w-3.5 h-3.5',
}: {
  label: string
  className?: string
}) {
  const Icon = LABEL_MAP[label]?.icon ?? ExternalLink
  return <Icon className={className} />
}
