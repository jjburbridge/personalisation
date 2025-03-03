import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {DoorsOpenInput} from './components/DoorsOpenInput'
import {Fallback} from './components/fallback'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  icon: CalendarIcon,
  type: 'document',
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: ['editorial', 'details'],
    }),
    defineField({
      name: 'newName',
      type: 'experimentString',
      group: ['editorial', 'details'],
    }),
    defineField({
      name: 'fallbackName',
      type: 'string',
      components: {
        input: Fallback,
      },
    }),
    defineField({
      name: 'intName',
      type: 'object',
      fields: [
        {name: 'en', type: 'string'},
        {name: 'no', type: 'string'},
        {name: 'langs', type: 'internationalizedArrayString'},
      ],
    }),
    defineField({
      name: 'text',
      type: 'textBlock',
    }),
    defineField({
      name: 'intText',
      type: 'internationalizedArrayTextBlock',
    }),
    // defineField({
    //   name: 'blah',
    //   type: 'object',
    //   fields: [
    //     {name: 'en', type: 'string'},
    //     {name: 'no', type: 'string'},
    //     {name: 'langs', type: 'internationalizedArrayString'},
    //   ],
    // }),
    // defineField({
    //   name: 'personalName',
    //   type: 'personalisationString',
    //   group: ['editorial', 'details'],
    // }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required().error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.name,
      group: 'details',
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio',
      },
      group: 'details',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'Number of minutes before the start time for admission',
      type: 'number',
      initialValue: 60,
      group: 'details',
      components: {input: DoorsOpenInput},
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
      readOnly: ({value, document}) => !value && document?.eventType === 'virtual',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'virtual') {
            return 'Only in-person events can have a venue'
          }

          return true
        }),
      group: 'details',
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{type: 'artist'}],
      group: 'details',
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
      group: 'editorial',
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      group: 'details',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'No date'

      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})
