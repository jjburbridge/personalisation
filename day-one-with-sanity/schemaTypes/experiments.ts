import {defineField, defineType} from 'sanity'

export const variant = defineType({
  name: 'variant',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      type: 'string',
    }),
    defineField({
      name: 'label',
      type: 'string',
    }),
  ],
})

export const experiments = defineType({
  name: 'experiments',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      type: 'string',
    }),
    defineField({
      name: 'label',
      type: 'string',
    }),
    defineField({
      name: 'variants',
      type: 'array',
      of: [{type: 'variant'}],
    }),
  ],
})
