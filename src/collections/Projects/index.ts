import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidateProjects'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'links',
      type: 'array',
      admin: {
        description: 'External links for this project',
      },
      fields: [
        {
          name: 'label',
          type: 'select',
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'Demo', value: 'demo' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Website', value: 'website' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'customLabel',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.label === 'other',
            description: 'Custom label when "Other" is selected',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Full URL',
          },
        },
      ],
    },
    {
      name: 'startDate',
      type: 'text',
      required: true,
      defaultValue: 'Present',
      admin: {
        description: 'e.g. "Jan 2024"',
      },
    },
    {
      name: 'endDate',
      type: 'text',
      defaultValue: 'Present',
      admin: {
        description: 'e.g. "Jun 2024" or "Present"',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
  },
  timestamps: true,
}
