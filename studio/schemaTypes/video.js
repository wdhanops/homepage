// schemas/video.js
export default {
  name: 'video',
  title: 'Video',
  type: 'document',
  orderings: [
    {
      title: 'Publish Date (newest first)',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
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
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Full YouTube URL — e.g. https://www.youtube.com/watch?v=XXXXXXXXXXX',
      validation: (R) => R.required(),
    },
    {
      name: 'youtubeId',
      title: 'YouTube Video ID',
      type: 'string',
      description: 'The 11-character ID from the URL (e.g. "dQw4w9WgXcQ"). Used to build the embed and thumbnail.',
      validation: (R) => R.required().min(11).max(11),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Music Video', value: 'music-video' },
          { title: 'Live', value: 'live' },
          { title: 'Lyric Video', value: 'lyric-video' },
          { title: 'Behind the Scenes', value: 'bts' },
          { title: 'Interview', value: 'interview' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
    },
    {
      name: 'relatedRelease',
      title: 'Related Release',
      type: 'reference',
      to: [{ type: 'release' }],
      description: 'Link this video to a release (optional).',
    },
        {
      name: 'relatedTrack',
      title: 'Related Track',
      type: 'reference',
      to: [{ type: 'track' }],
      description: 'Link this video to a track (optional).',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this video prominently on the homepage or /videos hero slot.',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      youtubeId: 'youtubeId',
    },
    prepare({ title, category, youtubeId }) {
      return {
        title,
        subtitle: category || '',
        // Sanity will render the YouTube thumbnail as a preview image
        imageUrl: youtubeId
          ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
          : undefined,
      };
    },
  },
};
