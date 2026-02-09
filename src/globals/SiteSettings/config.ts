import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Johnny',
      admin: {
        description: 'Used in "Hello, I\'m {name}."',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      defaultValue: 'Johnny Lin',
      admin: {
        description: 'Used in footer and metadata',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Tagline below the heading, e.g. "Software Engineer based in Singapore"',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Small circular avatar shown on the home page',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Intro paragraph on the home page',
      },
    },
    {
      name: 'resumeUrl',
      type: 'text',
      admin: {
        description: 'Link to your resume/CV file',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'githubUrl',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'linkedinUrl',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'emailAddress',
      type: 'text',
      admin: {
        description: 'Contact email address',
      },
    },
  ],
}
