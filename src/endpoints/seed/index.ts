import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const collectionsToClean: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
  'projects',
  'education',
  'experience',
]

const globals: GlobalSlug[] = ['header', 'footer']

// ---------------------------------------------------------------------------
// ID remapping utilities
// ---------------------------------------------------------------------------

type IdMap = Map<number, number>
type IdMaps = Record<string, IdMap>

function remapId(value: number | null | undefined, map: IdMap): number | null | undefined {
  if (value == null) return value
  return map.get(value) ?? value
}

function remapIds(
  values: number[] | null | undefined,
  map: IdMap,
): number[] | null | undefined {
  if (!values) return values
  return values.map((v) => map.get(v) ?? v)
}

/** Remap a polymorphic reference like { relationTo: 'pages', value: 5 } */
function remapReference(ref: any, idMaps: IdMaps): any {
  if (!ref || typeof ref !== 'object') return ref
  if (ref.relationTo && ref.value != null) {
    const map = idMaps[ref.relationTo]
    if (map) return { ...ref, value: map.get(ref.value) ?? ref.value }
  }
  return ref
}

/** Recursively remap IDs inside Lexical rich-text JSON */
function remapLexical(node: any, idMaps: IdMaps): any {
  if (!node || typeof node !== 'object') return node

  const result = Array.isArray(node) ? [...node] : { ...node }

  // Upload node
  if (result.type === 'upload' && result.relationTo) {
    const map = idMaps[result.relationTo]
    if (map) {
      if (typeof result.value === 'object' && result.value?.id != null) {
        result.value = { ...result.value, id: map.get(result.value.id) ?? result.value.id }
      } else if (typeof result.value === 'number') {
        result.value = map.get(result.value) ?? result.value
      }
    }
  }

  // Internal link node
  if (result.fields?.doc?.relationTo && result.fields?.doc?.value != null) {
    const map = idMaps[result.fields.doc.relationTo]
    if (map) {
      result.fields = {
        ...result.fields,
        doc: { ...result.fields.doc, value: map.get(result.fields.doc.value) ?? result.fields.doc.value },
      }
    }
  }

  // Recurse children
  if (Array.isArray(result.children)) {
    result.children = result.children.map((c: any) => remapLexical(c, idMaps))
  }

  return result
}

function remapRichText(content: any, idMaps: IdMaps): any {
  if (!content?.root) return content
  return { ...content, root: remapLexical(content.root, idMaps) }
}

function remapLink(linkData: any, idMaps: IdMaps): any {
  if (!linkData) return linkData
  return { ...linkData, reference: remapReference(linkData.reference, idMaps) }
}

function remapNavItems(items: any[] | null | undefined, idMaps: IdMaps): any[] | undefined {
  if (!items) return undefined
  return items.map((item) => ({ ...item, link: remapLink(item.link, idMaps) }))
}

function remapBlock(block: any, idMaps: IdMaps): any {
  if (!block) return block
  const mediaMap = idMaps.media ?? new Map()
  const catMap = idMaps.categories ?? new Map()
  const formMap = idMaps.forms ?? new Map()

  switch (block.blockType) {
    case 'mediaBlock':
      return { ...block, media: remapId(block.media, mediaMap) }

    case 'archive':
      return {
        ...block,
        categories: remapIds(block.categories, catMap),
        selectedDocs: block.selectedDocs?.map((d: any) =>
          typeof d === 'object' ? remapReference(d, idMaps) : d,
        ),
        introContent: block.introContent ? remapRichText(block.introContent, idMaps) : undefined,
      }

    case 'formBlock':
      return {
        ...block,
        form: remapId(block.form, formMap),
        introContent: block.introContent ? remapRichText(block.introContent, idMaps) : undefined,
      }

    case 'cta':
      return {
        ...block,
        richText: block.richText ? remapRichText(block.richText, idMaps) : undefined,
        links: block.links?.map((li: any) => ({ ...li, link: remapLink(li.link, idMaps) })),
      }

    case 'content':
      return {
        ...block,
        columns: block.columns?.map((col: any) => ({
          ...col,
          richText: col.richText ? remapRichText(col.richText, idMaps) : undefined,
          link: col.link ? remapLink(col.link, idMaps) : undefined,
        })),
      }

    case 'banner':
      return {
        ...block,
        content: block.content ? remapRichText(block.content, idMaps) : undefined,
      }

    default:
      return block
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMimeType(name: string): string {
  const ext = path.extname(name).toLowerCase()
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
  }
  return map[ext] || 'application/octet-stream'
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  const seedDataPath = path.resolve(dirname, 'seed-data.json')

  if (!fs.existsSync(seedDataPath)) {
    payload.logger.error(
      'seed-data.json not found. Run the export script first:\n  npx tsx src/endpoints/seed/export.ts',
    )
    return
  }

  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'))
  const idMaps: IdMaps = {}

  payload.logger.info('Seeding database...')

  // -----------------------------------------------------------------------
  // Clear existing data
  // -----------------------------------------------------------------------

  payload.logger.info('— Clearing collections and globals...')

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: { navItems: [] } as Record<string, unknown>,
        depth: 0,
        context: { disableRevalidate: true },
      }),
    ),
  )

  await Promise.all(
    collectionsToClean.map((collection) =>
      payload.db.deleteMany({ collection, req, where: {} }),
    ),
  )

  await Promise.all(
    collectionsToClean
      .filter((col) => Boolean(payload.collections[col]?.config.versions))
      .map((col) => payload.db.deleteVersions({ collection: col, req, where: {} })),
  )

  // -----------------------------------------------------------------------
  // Media
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding media...')
  idMaps.media = new Map()
  const mediaDir = path.resolve(dirname, 'media')

  for (const item of seedData.media ?? []) {
    if (!item.filename) continue

    const filePath = path.resolve(mediaDir, item.filename)
    if (!fs.existsSync(filePath)) {
      payload.logger.warn(`  Media file not found, skipping: ${item.filename}`)
      continue
    }

    try {
      const buffer = fs.readFileSync(filePath)
      const created = await payload.create({
        collection: 'media',
        data: {
          alt: item.alt ?? undefined,
          caption: item.caption ?? undefined,
          focalX: item.focalX ?? undefined,
          focalY: item.focalY ?? undefined,
        },
        file: {
          data: buffer,
          mimetype: getMimeType(item.filename),
          name: item.filename,
          size: buffer.length,
        },
      })
      idMaps.media.set(item.id, created.id)
    } catch (e) {
      payload.logger.error(`  Failed media ${item.filename}: ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Categories (root first, then children)
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding categories...')
  idMaps.categories = new Map()

  const sortedCategories = [...(seedData.categories ?? [])].sort((a: any, b: any) => {
    if (!a.parent && b.parent) return -1
    if (a.parent && !b.parent) return 1
    return 0
  })

  for (const item of sortedCategories) {
    try {
      const created = await payload.create({
        collection: 'categories',
        data: {
          title: item.title,
          parent: item.parent ? (remapId(item.parent, idMaps.categories) ?? undefined) : undefined,
        } as any,
      })
      idMaps.categories.set(item.id, created.id)
    } catch (e) {
      payload.logger.error(`  Failed category "${item.title}": ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Forms
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding forms...')
  idMaps.forms = new Map()

  for (const item of seedData.forms ?? []) {
    try {
      const { id, createdAt, updatedAt, ...data } = item
      const created = await payload.create({ collection: 'forms', data })
      idMaps.forms.set(item.id, created.id)
    } catch (e) {
      payload.logger.error(`  Failed form: ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Experience
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding experience...')

  for (const item of seedData.experience ?? []) {
    try {
      const { id, createdAt, updatedAt, ...data } = item
      await payload.create({
        collection: 'experience',
        data: {
          ...data,
          logo: remapId(data.logo, idMaps.media) ?? undefined,
          description: data.description ? remapRichText(data.description, idMaps) : undefined,
        },
      })
    } catch (e) {
      payload.logger.error(`  Failed experience "${item.title}": ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Education
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding education...')

  for (const item of seedData.education ?? []) {
    try {
      const { id, createdAt, updatedAt, ...data } = item
      await payload.create({
        collection: 'education',
        data: {
          ...data,
          logo: remapId(data.logo, idMaps.media) ?? undefined,
          description: data.description ? remapRichText(data.description, idMaps) : undefined,
        },
      })
    } catch (e) {
      payload.logger.error(`  Failed education "${item.title}": ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Projects
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding projects...')

  for (const item of seedData.projects ?? []) {
    try {
      const { id, createdAt, updatedAt, ...data } = item
      await payload.create({
        collection: 'projects',
        data: {
          ...data,
          image: remapId(data.image, idMaps.media) ?? undefined,
          description: data.description ? remapRichText(data.description, idMaps) : undefined,
        },
      })
    } catch (e) {
      payload.logger.error(`  Failed project "${item.title}": ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Pages
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding pages...')
  idMaps.pages = new Map()

  for (const item of seedData.pages ?? []) {
    try {
      const { id, createdAt, updatedAt, _status, ...data } = item

      const created = await payload.create({
        collection: 'pages',
        data: {
          ...data,
          _status: _status || 'published',
          hero: data.hero
            ? {
                ...data.hero,
                media: remapId(data.hero.media, idMaps.media) ?? undefined,
                richText: data.hero.richText
                  ? remapRichText(data.hero.richText, idMaps)
                  : undefined,
                links: data.hero.links?.map((li: any) => ({
                  ...li,
                  link: remapLink(li.link, idMaps),
                })),
              }
            : undefined,
          meta: data.meta
            ? { ...data.meta, image: remapId(data.meta.image, idMaps.media) ?? undefined }
            : undefined,
          layout: data.layout?.map((block: any) => remapBlock(block, idMaps)),
        },
        draft: _status === 'draft',
        context: { disableRevalidate: true },
      })
      idMaps.pages.set(item.id, created.id)
    } catch (e) {
      payload.logger.error(`  Failed page "${item.title}": ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Posts (first pass — skip relatedPosts to avoid circular refs)
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding posts...')
  idMaps.posts = new Map()

  for (const item of seedData.posts ?? []) {
    try {
      const { id, createdAt, updatedAt, _status, populatedAuthors, slug, ...data } = item

      const created = await payload.create({
        collection: 'posts',
        data: {
          ...data,
          slug,
          _status: _status || 'published',
          heroImage: remapId(data.heroImage, idMaps.media) ?? undefined,
          categories: remapIds(data.categories, idMaps.categories) ?? undefined,
          authors: undefined, // users aren't seeded
          relatedPosts: undefined, // second pass
          meta: data.meta
            ? { ...data.meta, image: remapId(data.meta.image, idMaps.media) ?? undefined }
            : undefined,
          content: data.content ? remapRichText(data.content, idMaps) : data.content,
          publishedAt: data.publishedAt,
        },
        draft: _status === 'draft',
        context: { disableRevalidate: true },
      })
      idMaps.posts.set(item.id, created.id)
    } catch (e) {
      payload.logger.error(`  Failed post "${item.title}": ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Posts — second pass: wire up relatedPosts
  // -----------------------------------------------------------------------

  payload.logger.info('— Linking related posts...')

  for (const item of seedData.posts ?? []) {
    if (!item.relatedPosts?.length) continue

    const newId = idMaps.posts.get(item.id)
    if (!newId) continue

    try {
      await payload.update({
        collection: 'posts',
        id: newId,
        data: { relatedPosts: remapIds(item.relatedPosts, idMaps.posts) ?? undefined },
        context: { disableRevalidate: true },
      })
    } catch (e) {
      payload.logger.error(`  Failed linking related posts for "${item.title}": ${(e as Error).message}`)
    }
  }

  // -----------------------------------------------------------------------
  // Globals
  // -----------------------------------------------------------------------

  payload.logger.info('— Seeding globals...')

  if (seedData.globals?.header) {
    await payload.updateGlobal({
      slug: 'header',
      data: { navItems: remapNavItems(seedData.globals.header.navItems, idMaps) ?? [] },
    })
  }

  if (seedData.globals?.footer) {
    await payload.updateGlobal({
      slug: 'footer',
      data: { navItems: remapNavItems(seedData.globals.footer.navItems, idMaps) ?? [] },
    })
  }

  if (seedData.globals?.siteSettings) {
    const { id, createdAt, updatedAt, globalType, ...settings } = seedData.globals.siteSettings
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        ...settings,
        profileImage: remapId(settings.profileImage, idMaps.media) ?? undefined,
      },
    })
  }

  payload.logger.info('Seeded database successfully!')
}
