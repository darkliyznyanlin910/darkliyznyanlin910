import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type TOCHeading = {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function extractTextFromChildren(children: any[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') return child.text ?? ''
      if (child.children) return extractTextFromChildren(child.children)
      return ''
    })
    .join('')
}

export function extractHeadings(content: DefaultTypedEditorState): TOCHeading[] {
  if (!content?.root?.children) return []

  const headings: TOCHeading[] = []
  const slugCounts = new Map<string, number>()

  for (const node of content.root.children) {
    if (node.type === 'heading' && 'tag' in node) {
      const text = extractTextFromChildren((node as any).children ?? [])
      if (!text.trim()) continue

      const level = parseInt((node as any).tag?.replace('h', '') ?? '2', 10)
      let slug = slugify(text)

      // Handle duplicate slugs
      const count = slugCounts.get(slug) ?? 0
      slugCounts.set(slug, count + 1)
      if (count > 0) slug = `${slug}-${count}`

      headings.push({ id: slug, text: text.trim(), level })
    }
  }

  return headings
}
