// schemas/stem.js
// Stems are linked to tracks. Actual files live in Cloudflare R2.
// Sanity holds metadata + R2 URLs only.
export default {
  name: 'stem',
  title: 'Stem',
  type: 'document',
  fields: [
    {
      name: 'track',
      title: 'Track',
      type: 'reference',
      to: [{ type: 'track' }],
      description: 'Which track do these stems belong to?',
      validation: (R) => R.required(),
    },
    {
      name: 'stemFiles',
      title: 'Stem Files',
      type: 'array',
      description: 'Each entry is one stem file stored in Cloudflare R2.',
      of: [
        {
          type: 'object',
          name: 'stemFile',
          fields: [
            {
              name: 'stemType',
              title: 'Stem Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Vocals', value: 'vocals' },
                  { title: 'Electric Guitar', value: 'electric-guitar' },
                  { title: 'Acoustic Guitar', value: 'acoustic-guitar' },
                  { title: 'Bass', value: 'bass' },
                  { title: 'Drums', value: 'drums' },
                  { title: 'Keys / Synth', value: 'keys' },
                  { title: 'Strings', value: 'strings' },
                  { title: 'Brass', value: 'brass' },
                  { title: 'Full Instrumental', value: 'instrumental' },
                  { title: 'Full Mix', value: 'full-mix' },
                  { title: 'A Cappella', value: 'acapella' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (R) => R.required(),
            },
            {
              name: 'r2Url',
              title: 'Cloudflare R2 URL',
              type: 'url',
              description: 'The full URL of this stem file in R2. Do not make this public-facing — it\'s accessed via the Worker only.',
              validation: (R) => R.required(),
            },
            {
              name: 'fileFormat',
              title: 'File Format',
              type: 'string',
              options: {
                list: [
                  { title: 'WAV (24-bit)', value: 'wav-24' },
                  { title: 'WAV (16-bit)', value: 'wav-16' },
                  { title: 'AIFF', value: 'aiff' },
                  { title: 'MP3 320kbps', value: 'mp3-320' },
                ],
              },
            },
            {
              name: 'sampleRate',
              title: 'Sample Rate',
              type: 'string',
              description: 'e.g. 44.1kHz, 48kHz',
            },
          ],
          preview: {
            select: { title: 'stemType', subtitle: 'fileFormat' },
          },
        },
      ],
    },
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 2,
      description: 'Internal only — not shown to sync supervisors.',
    },
  ],
  preview: {
    select: {
      track: 'track.title',
    },
    prepare({ track }) {
      return { title: `Stems — ${track || 'Unlinked'}` };
    },
  },
};
