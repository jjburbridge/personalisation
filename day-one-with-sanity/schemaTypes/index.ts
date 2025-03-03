import {eventType} from './eventType'
import {artistType} from './artistType'
import {venueType} from './venueType'
import {defineField, defineType} from 'sanity'
import {ArraySearch} from './components/ArrarySearch'

export const dictionary = defineType({
  name: 'dictionary',
  type: 'document',
  preview: {
    prepare: () => {
      return {title: 'Translated Strings'}
    },
  },
  fields: [
    defineField({
      name: 'strings',
      title: 'Dictionary',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'key', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'valu', type: 'internationalizedArrayString'},
          ],
        },
      ],
      components: {
        input: ArraySearch,
      },
    }),
  ],
})

const text = defineField({
  name: 'textBlock',
  type: 'object',
  fields: [
    {
      name: 'text',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
})

const formFields = defineField({
  name: 'formFields',
  type: 'object',
  fields: [
    {
      name: 'hubspot',
      type: 'hubSpotForm',
    },
    {
      name: 'mailchimp',
      type: 'mailchimpForm',
    },
    {name: 'native', type: 'reference', to: [{type: 'form'}]},
  ],
})

const form = defineType({
  name: 'personalForm',
  title: 'Personal Form',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    {
      name: 'form',
      type: 'experimentFormFields',
    },
  ],
})

export const eventSchemaTypes = [
  artistType,
  eventType,
  venueType,
  dictionary,
  text,
  // form,
  formFields,
]
export const formSchemaType = [form, formFields]
