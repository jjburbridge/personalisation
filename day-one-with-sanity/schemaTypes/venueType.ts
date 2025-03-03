import {defineField, defineType} from 'sanity'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'strings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'key', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'string', type: 'internationalizedArrayString'},
          ],
        },
      ],
    }),
  ],
})
