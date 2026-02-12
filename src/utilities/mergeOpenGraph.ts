import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: "Johnny Lin's portfolio — software engineer based in Singapore.",
  siteName: 'Johnny Lin',
  title: 'Johnny Lin',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    ...(og?.images ? { images: og.images } : {}),
  }
}
