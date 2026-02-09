import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import {
  revalidateEducation,
  revalidateEducationDelete,
} from './hooks/revalidateEducation'

export const Education: CollectionConfig = {
  slug: 'education',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'institution', 'order', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Bachelor of Science (Information Systems)"',
      },
    },
    {
      name: 'institution',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Singapore Management University"',
      },
    },
    {
      name: 'links',
      type: 'array',
      admin: {
        description: 'External links for this entry',
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
      admin: {
        description: 'e.g. "Aug 2023"',
      },
    },
    {
      name: 'endDate',
      type: 'text',
      defaultValue: 'Present',
      admin: {
        description: 'e.g. "May 2027" or "Present"',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
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
    afterChange: [revalidateEducation],
    afterDelete: [revalidateEducationDelete],
  },
  timestamps: true,
}
