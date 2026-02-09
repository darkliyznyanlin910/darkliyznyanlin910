import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateExperience: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating experience`)

    revalidatePath('/experience')
    revalidatePath('/')
  }

  return doc
}

export const revalidateExperienceDelete: CollectionAfterDeleteHook = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/experience')
    revalidatePath('/')
  }
}
