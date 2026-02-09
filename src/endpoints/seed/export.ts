/**
 * Export script - fetches all data from Payload CMS REST API and saves to seed-data.json
 *
 * Usage:
 *   npx tsx src/endpoints/seed/export.ts
 *
 * Environment variables:
 *   PAYLOAD_URL       - API base URL (default: http://localhost:3000)
 *   PAYLOAD_EMAIL     - Admin email for auth (optional, needed for draft content)
 *   PAYLOAD_PASSWORD  - Admin password (optional)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_BASE = (process.env.PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')
const AUTH_EMAIL = process.env.PAYLOAD_EMAIL
const AUTH_PASSWORD = process.env.PAYLOAD_PASSWORD

let authToken: string | null = null

async function login(): Promise<void> {
  if (!AUTH_EMAIL || !AUTH_PASSWORD) {
    console.log('No auth credentials provided. Only public data will be exported.')
    console.log('Set PAYLOAD_EMAIL and PAYLOAD_PASSWORD to include draft content.\n')
    return
  }

  const res = await fetch(`${API_BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD }),
  })

  if (!res.ok) throw new Error(`Login failed: ${res.statusText}`)
  const data = await res.json()
  authToken = data.token
  console.log('Logged in successfully.\n')
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {}
  if (authToken) h['Authorization'] = `JWT ${authToken}`
  return h
}

async function fetchCollection(
  slug: string,
  extraParams: Record<string, string> = {},
): Promise<any[]> {
  const params = new URLSearchParams({ limit: '1000', depth: '0', ...extraParams })
  const res = await fetch(`${API_BASE}/api/${slug}?${params}`, { headers: headers() })
  if (!res.ok) {
    console.warn(`  ⚠ Failed to fetch ${slug}: ${res.status} ${res.statusText}`)
    return []
  }
  const data = await res.json()
  return data.docs || []
}

async function fetchGlobal(slug: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/globals/${slug}?depth=0`, { headers: headers() })
  if (!res.ok) {
    console.warn(`  ⚠ Failed to fetch global ${slug}: ${res.status} ${res.statusText}`)
    return {}
  }
  return res.json()
}

async function downloadMedia(docs: any[]): Promise<void> {
  const mediaDir = path.join(__dirname, 'media')
  fs.mkdirSync(mediaDir, { recursive: true })

  for (const doc of docs) {
    if (!doc.filename || !doc.url) continue

    const url = doc.url.startsWith('http') ? doc.url : `${API_BASE}${doc.url}`
    process.stdout.write(`  ↓ ${doc.filename} ... `)

    try {
      const res = await fetch(url, { headers: headers() })
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer())
        fs.writeFileSync(path.join(mediaDir, doc.filename), buffer)
        console.log(`${(buffer.length / 1024).toFixed(1)}KB`)
      } else {
        console.log(`FAILED (${res.status})`)
      }
    } catch (e) {
      console.log(`ERROR: ${(e as Error).message}`)
    }
  }
}

async function main() {
  console.log(`Exporting data from ${API_BASE}\n`)

  await login()

  console.log('Fetching collections...')
  const [media, categories, experience, education, projects, pages, posts, forms] =
    await Promise.all([
      fetchCollection('media'),
      fetchCollection('categories'),
      fetchCollection('experience'),
      fetchCollection('education'),
      fetchCollection('projects'),
      fetchCollection('pages', { draft: 'true' }),
      fetchCollection('posts', { draft: 'true' }),
      fetchCollection('forms'),
    ])

  console.log('Fetching globals...')
  const [header, footer, siteSettings] = await Promise.all([
    fetchGlobal('header'),
    fetchGlobal('footer'),
    fetchGlobal('site-settings'),
  ])

  console.log('\nDownloading media files...')
  await downloadMedia(media)

  const seedData = {
    media,
    categories,
    experience,
    education,
    projects,
    pages,
    posts,
    forms,
    globals: { header, footer, siteSettings },
  }

  const outputPath = path.join(__dirname, 'seed-data.json')
  fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2))

  console.log('\n✓ Export complete!')
  console.log(`  Media:      ${media.length} files`)
  console.log(`  Categories: ${categories.length}`)
  console.log(`  Experience: ${experience.length}`)
  console.log(`  Education:  ${education.length}`)
  console.log(`  Projects:   ${projects.length}`)
  console.log(`  Pages:      ${pages.length}`)
  console.log(`  Posts:       ${posts.length}`)
  console.log(`  Forms:      ${forms.length}`)
  console.log(`\nSeed data → ${outputPath}`)
  console.log(`Media dir → ${path.join(__dirname, 'media')}/`)
}

main().catch((e) => {
  console.error('\nExport failed:', e)
  process.exit(1)
})
