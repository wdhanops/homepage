// schemas/pressCoverage.js
export default {
  name: 'pressCoverage',
  title: 'Press Coverage',
  type: 'document',
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  fields: [
    {
      name: 'publication',
      title: 'Publication',
      type: 'string',
      description: 'e.g. "NME", "Pitchfork", "DIY Magazine"',
      validation: (R) => R.required(),
    },
    {
      name: 'publicationLogo',
      title: 'Publication Logo',
      type: 'image',
      description: 'Optional. Shown on /press and /presskit.',
      options: { hotspot: false },
    },
    {
      name: 'headline',
      title: 'Headline / Article Title',
      type: 'string',
    },
    {
      name: 'quote',
      title: 'Pull Quote',
      type: 'text',
      rows: 3,
      description: 'A single standout quote from the review or feature. Used in press kit and /press page.',
      validation: (R) => R.required(),
    },
    {
      name: 'url',
      title: 'Article URL',
      type: 'url',
      description: 'Link to the original article.',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (R) => R.required(),
    },
    {
      name: 'coverageType',
      title: 'Coverage Type',
      type: 'string',
      options: {
        list: [
          { title: 'Review', value: 'review' },
          { title: 'Feature', value: 'feature' },
          { title: 'Interview', value: 'interview' },
          { title: 'Premiere', value: 'premiere' },
          { title: 'Mention', value: 'mention' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'relatedRelease',
      title: 'Related Release',
      type: 'reference',
      to: [{ type: 'release' }],
      description: 'Which release does this coverage relate to?',
    },
    {
      name: 'featuredOnPressKit',
      title: 'Feature on Press Kit',
      type: 'boolean',
      description: 'Include this quote prominently on /presskit.',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'publication',
      subtitle: 'headline',
      media: 'publicationLogo',
    },
  },
};
