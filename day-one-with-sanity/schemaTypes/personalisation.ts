import {defineField, defineArrayMember, defineType} from 'sanity'

export const PersonalisationType = defineType({
  type: 'document',
  name: 'Personalisation',
  title: 'Personalisation Document',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      validation: (e) => e.required(),
    }),
    defineField({
      type: 'audienceText',
      name: 'description',
      title: 'description',
    }),
    defineField({
      type: 'audienceImage',
      name: 'image',
      title: 'Image',
    }),
    defineField({
      type: 'array',
      name: 'content',
      title: 'Content',
      validation: (e) => e.required(),
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
})
