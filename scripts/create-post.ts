import { Lexer, type Token, type Tokens } from 'marked'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

// --- Frontmatter ---

interface Frontmatter {
  title: string
  slug: string
  categories?: string[]
}

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) throw new Error('Missing frontmatter (---) delimiters')

  const lines = match[1].split('\n')
  const body = match[2]
  const data: Record<string, any> = {}
  let currentKey = ''

  for (const line of lines) {
    const arrayItem = line.match(/^\s+-\s+(.+)$/)
    if (arrayItem && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      data[currentKey].push(arrayItem[1].trim())
      continue
    }

    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) {
      currentKey = kv[1]
      const value = kv[2].trim()
      if (value) data[currentKey] = value
    }
  }

  if (!data.title) throw new Error('Frontmatter missing required "title" field')
  if (!data.slug) throw new Error('Frontmatter missing required "slug" field')

  return { data: data as Frontmatter, body }
}

// --- Lexical Node Builders ---

function textNode(text: string, format: number = 0) {
  return {
    mode: 'normal',
    text,
    type: 'text',
    style: '',
    detail: 0,
    format,
    version: 1,
  }
}

function headingNode(depth: number, children: any[]) {
  return {
    tag: `h${depth}`,
    type: 'heading',
    format: '',
    indent: 0,
    version: 1,
    children,
    direction: null,
  }
}

function paragraphNode(children: any[]) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children,
    direction: null,
    textStyle: '',
    textFormat: 0,
  }
}

function quoteNode(children: any[]) {
  return {
    type: 'quote',
    format: '',
    indent: 0,
    version: 1,
    children,
    direction: null,
  }
}

function linkNode(url: string, children: any[]) {
  return {
    type: 'link',
    fields: { url, linkType: 'custom', newTab: false },
    format: '',
    indent: 0,
    version: 3,
    children,
    direction: null,
  }
}

function horizontalRuleNode() {
  return { type: 'horizontalrule', version: 1 }
}

function linebreakNode() {
  return { type: 'linebreak', version: 1 }
}

const LANGUAGE_MAP: Record<string, string> = {
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',
  css: 'css',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yaml: 'yaml',
  yml: 'yaml',
  json: 'json',
  html: 'html',
  stdout: 'stdout',
  output: 'stdout',
  log: 'stdout',
  plaintext: 'stdout',
  txt: 'stdout',
}

function codeBlockNode(code: string, lang: string) {
  const language = LANGUAGE_MAP[lang.toLowerCase()] || 'typescript'
  return {
    type: 'block',
    fields: {
      code,
      language,
      blockName: '',
      blockType: 'code',
    },
    format: '',
    version: 2,
  }
}

// Lexical format bitmask: bold=1 italic=2 strikethrough=4 underline=8 code=16

function processInlineTokens(tokens: Token[], format: number = 0): any[] {
  const nodes: any[] = []

  for (const token of tokens) {
    switch (token.type) {
      case 'text': {
        const t = token as Tokens.Text
        if (t.tokens && t.tokens.length > 0) {
          nodes.push(...processInlineTokens(t.tokens, format))
        } else {
          nodes.push(textNode(t.text, format))
        }
        break
      }
      case 'strong': {
        const t = token as Tokens.Strong
        nodes.push(...processInlineTokens(t.tokens, format | 1))
        break
      }
      case 'em': {
        const t = token as Tokens.Em
        nodes.push(...processInlineTokens(t.tokens, format | 2))
        break
      }
      case 'del': {
        const t = token as Tokens.Del
        nodes.push(...processInlineTokens(t.tokens, format | 4))
        break
      }
      case 'codespan': {
        const t = token as Tokens.Codespan
        nodes.push(textNode(t.text, format | 16))
        break
      }
      case 'link': {
        const t = token as Tokens.Link
        nodes.push(linkNode(t.href, processInlineTokens(t.tokens, 0)))
        break
      }
      case 'image': {
        const t = token as Tokens.Image
        if (t.text) nodes.push(textNode(t.text, format))
        break
      }
      case 'br':
        nodes.push(linebreakNode())
        break
      case 'escape': {
        const t = token as Tokens.Escape
        nodes.push(textNode(t.text, format))
        break
      }
      default:
        if ('text' in token && typeof token.text === 'string') {
          nodes.push(textNode(token.text, format))
        }
        break
    }
  }

  return nodes
}

function extractListItemInlineTokens(item: Tokens.ListItem): Token[] {
  const result: Token[] = []
  for (const token of item.tokens) {
    if ((token.type === 'text' || token.type === 'paragraph') && 'tokens' in token && token.tokens) {
      result.push(...token.tokens)
    }
  }
  return result
}

function processBlockTokens(tokens: Token[]): any[] {
  const nodes: any[] = []

  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        const t = token as Tokens.Heading
        nodes.push(headingNode(t.depth, processInlineTokens(t.tokens)))
        break
      }
      case 'paragraph': {
        const t = token as Tokens.Paragraph
        nodes.push(paragraphNode(processInlineTokens(t.tokens)))
        break
      }
      case 'code': {
        const t = token as Tokens.Code
        nodes.push(codeBlockNode(t.text, t.lang || ''))
        break
      }
      case 'blockquote': {
        const t = token as Tokens.Blockquote
        for (const inner of t.tokens) {
          if (inner.type === 'paragraph') {
            const p = inner as Tokens.Paragraph
            nodes.push(quoteNode(processInlineTokens(p.tokens)))
          }
        }
        break
      }
      case 'list': {
        const t = token as Tokens.List
        const ordered = t.ordered
        nodes.push({
          type: 'list',
          listType: ordered ? 'number' : 'bullet',
          format: '',
          indent: 0,
          version: 1,
          children: t.items.map((item: Tokens.ListItem, i: number) => ({
            type: 'listitem',
            format: '',
            indent: 0,
            version: 1,
            value: i + 1,
            children: processInlineTokens(extractListItemInlineTokens(item)),
            direction: null,
          })),
          direction: null,
          tag: ordered ? 'ol' : 'ul',
          start: 1,
        })
        break
      }
      case 'hr':
        nodes.push(horizontalRuleNode())
        break
      case 'space':
        break
      default:
        break
    }
  }

  return nodes
}

function markdownToLexical(markdown: string) {
  const tokens = Lexer.lex(markdown)
  const children = processBlockTokens(tokens)
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
      direction: null,
    },
  }
}

// --- API Client ---

interface AuthInfo {
  token: string
  cookie: string
}

function authHeaders(auth: AuthInfo): Record<string, string> {
  return {
    Authorization: `JWT ${auth.token}`,
    Cookie: auth.cookie,
  }
}

async function authFetch(url: string, init: RequestInit & { headers: Record<string, string> }) {
  const res = await fetch(url, { ...init, redirect: 'manual' })
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get('location')
    if (location) return fetch(location, init)
  }
  return res
}

async function login(serverUrl: string, email: string, password: string): Promise<AuthInfo> {
  const res = await fetch(`${serverUrl}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    redirect: 'follow',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Login failed (${res.status}): ${text}`)
  }
  const setCookie = res.headers.getSetCookie?.().join('; ') || res.headers.get('set-cookie') || ''
  const cookie = setCookie
    .split(',')
    .map((c) => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ')
  const data = await res.json()
  return { token: data.token, cookie }
}

async function getCategories(serverUrl: string, auth: AuthInfo): Promise<any[]> {
  const res = await authFetch(`${serverUrl}/api/categories?limit=100&depth=0`, {
    headers: authHeaders(auth),
  })
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`)
  const data = await res.json()
  return data.docs
}

async function createDraftPost(
  serverUrl: string,
  auth: AuthInfo,
  postData: Record<string, any>,
): Promise<any> {
  const res = await authFetch(`${serverUrl}/api/posts?draft=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(auth),
    },
    body: JSON.stringify(postData),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to create post (${res.status}): ${text}`)
  }
  return res.json()
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const filePath = args.find((a) => !a.startsWith('--'))

  if (!filePath) {
    console.error('Usage: bun run create-post <path-to-markdown-file> [--dry-run]')
    console.error('Example: bun run create-post content/posts/example-post.md --dry-run')
    process.exit(1)
  }

  const resolved = path.resolve(filePath)
  if (!existsSync(resolved)) {
    console.error(`File not found: ${resolved}`)
    process.exit(1)
  }

  const raw = readFileSync(resolved, 'utf-8')
  const { data: frontmatter, body } = parseFrontmatter(raw)
  const content = markdownToLexical(body)

  console.log(`Parsed: "${frontmatter.title}" (${frontmatter.slug})`)

  if (dryRun) {
    const outPath = resolved.replace(/\.md$/, '.json')
    const payload = {
      title: frontmatter.title,
      slug: frontmatter.slug,
      content,
      categories: frontmatter.categories || [],
    }
    const { writeFileSync } = await import('fs')
    writeFileSync(outPath, JSON.stringify(payload, null, 2))
    console.log(`Dry run: wrote JSON to ${outPath}`)
    return
  }

  const serverUrl = (process.env.PAYLOAD_URL || 'https://www.johnnyknl.com').replace(/\/$/, '')
  const email = process.env.PAYLOAD_EMAIL
  const password = process.env.PAYLOAD_PASSWORD

  if (!email || !password) {
    console.error('Missing PAYLOAD_EMAIL or PAYLOAD_PASSWORD environment variables.')
    console.error('Set them in .env or export before running.')
    process.exit(1)
  }

  console.log(`Logging in to ${serverUrl}...`)
  const auth = await login(serverUrl, email, password)
  console.log('Authenticated.')

  let categoryIds: number[] = []
  if (frontmatter.categories?.length) {
    const allCategories = await getCategories(serverUrl, auth)
    categoryIds = frontmatter.categories
      .map((slug) => {
        const cat = allCategories.find(
          (c: any) => c.slug === slug || c.title.toLowerCase() === slug.toLowerCase(),
        )
        if (!cat) {
          console.warn(`  Category "${slug}" not found, skipping`)
          return null
        }
        return cat.id
      })
      .filter((id): id is number => id !== null)
  }

  console.log('Creating draft post...')
  const post = await createDraftPost(serverUrl, auth, {
    title: frontmatter.title,
    slug: frontmatter.slug,
    content,
    categories: categoryIds.length > 0 ? categoryIds : undefined,
  })

  console.log(`\nDraft created: ${serverUrl}/admin/collections/posts/${post.doc.id}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
