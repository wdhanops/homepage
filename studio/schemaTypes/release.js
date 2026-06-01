// schemas/release.js
export default {
  name: 'release',
  title: 'Release',
  type: 'document',
  orderings: [
    {
      title: 'Release Date (newest first)',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseDate', direction: 'desc' }],
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-safe identifier — e.g. "wild-things". Used for /music/wild-things',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    },
    {
      name: 'releaseType',
      title: 'Release Type',
      type: 'string',
      options: {
        list: [
          { title: 'Single', value: 'single' },
          { title: 'EP', value: 'ep' },
          { title: 'Album', value: 'album' },
          { title: 'Remix', value: 'remix' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    },
    {
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (R) => R.required(),
    },
    {
      name: 'artwork',
      title: 'Artwork',
      type: 'image',
      description: 'Square cover art. Minimum 3000×3000px recommended.',
      options: { hotspot: true },
      validation: (R) => R.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Full release description shown on the music page.',
      of: [{ type: 'block' }],
    },
    {
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'track' }] }],
      description: 'Ordered tracklist. Add tracks first, then reference them here.',
    },
    // Streaming links
    {
      name: 'streamingLinks',
      title: 'Streaming Links',
      type: 'object',
      fields: [
        { name: 'spotify', title: 'Spotify URL', type: 'url' },
        { name: 'appleMusic', title: 'Apple Music URL', type: 'url' },
        { name: 'youtube', title: 'YouTube Music URL', type: 'url' },
        { name: 'tidal', title: 'Tidal URL', type: 'url' },
        { name: 'amazonMusic', title: 'Amazon Music URL', type: 'url' },
        { name: 'bandcamp', title: 'Bandcamp URL', type: 'url' },
        { name: 'soundcloud', title: 'SoundCloud URL', type: 'url' },
      ],
    },
    {
      name: 'shopifyBuyLink',
      title: 'Shopify MP3 Buy Link',
      type: 'url',
      description: 'Direct Shopify product link for digital download (if applicable).',
    },
    // For singles — link back to parent EP/album
    {
      name: 'parentRelease',
      title: 'Parent Release',
      type: 'reference',
      to: [{ type: 'release' }],
      description: 'If this single is part of an EP or album, link it here.',
      hidden: ({ document }) => document?.releaseType !== 'single',
    },
    {
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      description: 'Pin this release to the hero / homepage spotlight.',
      initialValue: false,
    },
    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string', description: 'Defaults to release title if blank.' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      releaseType: 'releaseType',
      releaseDate: 'releaseDate',
      media: 'artwork',
    },
    prepare({ title, releaseType, releaseDate, media }) {
      const type = releaseType ? releaseType.toUpperCase() : '';
      const year = releaseDate ? releaseDate.slice(0, 4) : '';
      return { title, subtitle: `${type} · ${year}`, media };
    },
  },
};
