import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateEducation: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating education`)

    revalidatePath('/education')
  }

  return doc
}

export const revalidateEducationDelete: CollectionAfterDeleteHook = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/education')
  }
}
