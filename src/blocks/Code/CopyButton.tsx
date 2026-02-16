'use client'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
      aria-label="Copy code"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}
