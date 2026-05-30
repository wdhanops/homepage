// schemas/galleryImage.js
export default {
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    },
    {
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility and SEO.',
      validation: (R) => R.required(),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption shown in gallery lightbox.',
    },
    {
      name: 'photographerCredit',
      title: 'Photographer Credit',
      type: 'string',
      description: 'e.g. "Photo: Jane Smith"',
    },
    {
      name: 'dateTaken',
      title: 'Date Taken',
      type: 'date',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Live', value: 'live' },
          { title: 'Promo', value: 'promo' },
          { title: 'Press', value: 'press' },
          { title: 'Candid', value: 'candid' },
          { title: 'Studio', value: 'studio' },
          { title: 'Behind the Scenes', value: 'bts' },
        ],
        layout: 'tags',
      },
    },
    {
      name: 'pressKitApproved',
      title: 'Press Kit Approved',
      type: 'boolean',
      description: 'Only approved images appear on /press and /presskit. Toggle off to keep in gallery but exclude from press materials.',
      initialValue: false,
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Pin to top of gallery.',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      media: 'image',
      title: 'altText',
      subtitle: 'photographerCredit',
    },
  },
};
