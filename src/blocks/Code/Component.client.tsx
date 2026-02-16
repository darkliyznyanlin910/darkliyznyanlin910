'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import { CopyButton } from './CopyButton'

type Props = {
  code: string
  language?: string
}

const languageLabels: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  css: 'CSS',
  bash: 'Bash',
  stdout: 'Output',
  yaml: 'YAML',
  json: 'JSON',
  html: 'HTML',
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  const label = languageLabels[language] || language

  return (
    <div className="rounded-lg border border-border bg-[#1a1a1a] overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-[#111]">
        {label ? (
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        ) : (
          <span />
        )}
        <CopyButton code={code} />
      </div>
      <Highlight code={code} language={language} theme={themes.vsDark}>
        {({ getLineProps, getTokenProps, tokens }) => (
          <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed bg-transparent m-0">
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ className: 'table-row', line })}>
                  <span className="table-cell select-none text-right pr-4 text-white/20 w-[1%] whitespace-nowrap">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
