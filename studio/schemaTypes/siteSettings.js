// schemas/siteSettings.js
// Singleton document — one instance, controls global site settings.
// In Sanity Studio, use a "singleton" plugin or just limit to one document.
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Prevent creating multiple instances
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'bandName',
      title: 'Band Name',
      type: 'string',
      initialValue: 'WD-HAN',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short line used in meta descriptions, footer, etc.',
    },
    {
      name: 'bandLogo',
      title: 'Band Logo',
      type: 'image',
      description: 'Primary logo. Used in nav and footer.',
    },
    {
      name: 'bandLogoDark',
      title: 'Band Logo (Dark version)',
      type: 'image',
      description: 'Version for light backgrounds, if needed.',
    },
    {
      name: 'bio',
      title: 'Band Bio (Short)',
      type: 'text',
      rows: 4,
      description: 'Short bio used in press kit, meta descriptions, and compact layouts.',
    },
    {
      name: 'bioLong',
      title: 'Band Bio (Full)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Full bio for the /about page.',
    },
    {
      name: 'socials',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'tiktok', title: 'TikTok URL', type: 'url' },
        { name: 'youtube', title: 'YouTube Channel URL', type: 'url' },
        { name: 'spotify', title: 'Spotify Artist URL', type: 'url' },
        { name: 'appleMusic', title: 'Apple Music URL', type: 'url' },
        { name: 'bandcamp', title: 'Bandcamp URL', type: 'url' },
        { name: 'facebook', title: 'Facebook URL', type: 'url' },
        { name: 'twitter', title: 'Twitter / X URL', type: 'url' },
      ],
    },
    {
      name: 'contactEmail',
      title: 'General Contact Email',
      type: 'string',
    },
    {
      name: 'bookingEmail',
      title: 'Booking Email',
      type: 'string',
    },
    {
      name: 'pressEmail',
      title: 'Press Email',
      type: 'string',
    },
    {
      name: 'shopifyMerchUrl',
      title: 'Shopify Merch URL',
      type: 'url',
      description: 'The .myshopify.com checkout URL or your custom merch page.',
    },
    // Press kit downloadable assets
    {
      name: 'pressKitPdf',
      title: 'Press Kit PDF',
      type: 'file',
      description: 'Downloadable EPK PDF. Updated as needed.',
      options: { accept: '.pdf' },
    },
    // Bandsintown
    {
      name: 'bandsintownArtistId',
      title: 'Bandsintown Artist ID / Name',
      type: 'string',
      description: 'Your artist name as it appears on Bandsintown — used for the embed widget.',
    },
    // SEO defaults
    {
      name: 'seoDefaults',
      title: 'SEO Defaults',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string',
          description: 'Used when a page has no specific meta title.',
        },
        {
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'ogImage',
          title: 'Default OG / Share Image',
          type: 'image',
          description: 'Used when sharing pages on social media.',
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
};
