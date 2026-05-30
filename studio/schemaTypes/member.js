// schemas/member.js
export default {
  name: 'member',
  title: 'Band Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (R) => R.required(),
    },
    {
      name: 'role',
      title: 'Role / Instrument',
      type: 'string',
      description: 'e.g. "Vocals", "Guitar / Keys", "Drums"',
      validation: (R) => R.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the order members appear on the about page. Lower = first.',
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Individual member photo. Minimum 1200×1200px.',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Full bio shown on the about page.',
    },
    {
      name: 'bioShort',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'One or two sentences. Used in press kit and compact layouts.',
    },
    {
      name: 'socials',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'twitter', title: 'Twitter / X URL', type: 'url' },
        { name: 'tiktok', title: 'TikTok URL', type: 'url' },
      ],
    },
    {
      name: 'includeInPressKit',
      title: 'Include in Press Kit',
      type: 'boolean',
      description: 'Show this member\'s bio and photo on the /presskit page.',
      initialValue: true,
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
};
