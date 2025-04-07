import {defineType, defineField, defineArrayMember} from 'sanity'

export const Article = defineType({
  type: 'document',
  name: 'article',
  title: 'Article Document',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Article Title',
      validation: (e) => e.required(),
    }),
    defineField({
      type: 'experimentImage',
      name: 'featureImage',
      title: 'Feature Image',
    }),
    defineField({type: 'experimentText', name: 'description', title: 'Description'}),
    defineField({
      type: 'array',
      name: 'content',
      title: 'Article Content',
      validation: (e) => e.required(),
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({type: 'date', name: 'publishDate', title: 'Publish Date'}),
    defineField({type: 'string', name: 'language', title: 'Language'}),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Slug',
      validation: (e) => e.required(),
      options: {
        source: 'Title',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishDate',
      media: 'featureImage.default',
    },
  },
})
