import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateProject: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating projects`)

    revalidatePath('/projects')
  }

  return doc
}

export const revalidateProjectDelete: CollectionAfterDeleteHook = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/projects')
  }
}
