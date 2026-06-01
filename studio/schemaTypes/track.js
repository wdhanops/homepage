// schemas/track.js
export default {
  name: 'track',
  title: 'Track',
  type: 'document',
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
      description: 'Used for individual track pages — e.g. /music/wild-things/track-title',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    },
    {
      name: 'trackNumber',
      title: 'Track Number',
      type: 'number',
      description: 'Position on the release.',
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g. 3:42',
    },
    {
      name: 'isrc',
      title: 'ISRC',
      type: 'string',
      description: 'International Standard Recording Code. Important for sync and royalties.',
    },
    {
  name: 'streamingLinks',
  title: 'Streaming Links',
  type: 'object',
  fields: [
    { name: 'spotify',      title: 'Spotify URL',       type: 'url' },
    { name: 'appleMusic',   title: 'Apple Music URL',   type: 'url' },
    { name: 'youtube',      title: 'YouTube URL',       type: 'url' },
    { name: 'youtubeMusic', title: 'YouTube Music URL', type: 'url' },
    { name: 'tidal',        title: 'Tidal URL',         type: 'url' },
    { name: 'amazonMusic',  title: 'Amazon Music URL',  type: 'url' },
    { name: 'deezer',       title: 'Deezer URL',        type: 'url' },
    { name: 'soundcloud',   title: 'SoundCloud URL',    type: 'url' },
    { name: 'bandcamp',     title: 'Bandcamp URL',      type: 'url' },
  ],
},
    {
      name: 'composerCredits',
      title: 'Composer Credits',
      type: 'string',
      description: 'e.g. "Barnes / Henry / Campbell". Used for publishing.',
    },
    {
      name: 'lyricsExcerpt',
      title: 'Lyrics Excerpt',
      type: 'text',
      rows: 4,
      description: 'A short excerpt (chorus or hook). Adds SEO value on individual track pages. Do not paste full lyrics.',
    },
    {
      name: 'parentRelease',
      title: 'Parent Release',
      type: 'reference',
      to: [{ type: 'release' }],
      description: 'The EP or album this track belongs to.',
    },
    // Sync metadata — lives here so it can be surfaced on /sync without needing stems
    {
      name: 'syncMeta',
      title: 'Sync Metadata',
      type: 'object',
      description: 'Metadata for music supervisors. Shown on the /sync page.',
      fields: [
        {
          name: 'bpm',
          title: 'BPM',
          type: 'number',
        },
        {
          name: 'musicalKey',
          title: 'Key',
          type: 'string',
          description: 'e.g. A minor, C major',
        },
        {
          name: 'moodTags',
          title: 'Mood Tags',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              'Energetic', 'Melancholic', 'Euphoric', 'Tense', 'Dreamy',
              'Aggressive', 'Romantic', 'Nostalgic', 'Dark', 'Uplifting',
              'Anthemic', 'Intimate', 'Cinematic', 'Chaotic', 'Hopeful',
            ],
            layout: 'tags',
          },
        },
        {
          name: 'genreTags',
          title: 'Genre Tags',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              'Alt-Rock', 'Indie Rock', 'Pop-Rock', 'Post-Punk', 'Shoegaze',
              'Dream Pop', 'Garage Rock', 'Indie Pop', 'Alternative',
            ],
            layout: 'tags',
          },
        },
        {
          name: 'instrumentation',
          title: 'Instrumentation',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              'Vocals', 'Electric Guitar', 'Acoustic Guitar', 'Bass Guitar',
              'Drums', 'Synth', 'Piano', 'Strings', 'Brass', 'No Vocals',
            ],
            layout: 'tags',
          },
        },
        {
          name: 'syncDescription',
          title: 'Sync Description',
          type: 'text',
          rows: 3,
          description: 'Written for music supervisors. e.g. "Driving rock track with anthemic chorus — suited to sports, chase sequences, or coming-of-age montages."',
        },
        {
          name: 'availableForSync',
          title: 'Available for Sync',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'previewUrl',
          title: '30-Second Watermarked Preview URL',
          type: 'url',
          description: 'Link to the watermarked preview audio file (stored in Cloudflare R2).',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      trackNumber: 'trackNumber',
      duration: 'duration',
      release: 'parentRelease.title',
    },
    prepare({ title, trackNumber, duration, release }) {
      const num = trackNumber ? `${trackNumber}. ` : '';
      const dur = duration ? ` · ${duration}` : '';
      return { title: `${num}${title}`, subtitle: `${release || ''}${dur}` };
    },
  },
};
