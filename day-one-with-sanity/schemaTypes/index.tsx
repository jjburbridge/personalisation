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

function EditorMessage() {
  return (
    <p style={{fontSize: '18px', fontFamily: 'Inter'}}>
      Before creating a new experiment, be sure to read: <br />
      <a href="https://www.sanity.io/app/create/674f7568557235326d/390f2aed-c098-438e-a9ff-e4cf7b551ebd">
        Running experiments on the marketing website
      </a>
    </p>
  )
}

export const growthbookVariant = defineType({
  name: 'growthbookPath',
  type: 'string',
  validation: (Rule) =>
    Rule.required().custom(async (value: string | undefined, context) => {
      if (!value) return true
      if (!value.startsWith('/')) return 'Must start with "/"'
      return true
    }),
})

export const experimentSettings = defineType({
  name: 'growthbookSettings',
  type: 'document',
  title: 'Routing Experiments',
  fields: [
    {
      name: 'editorMessage',
      type: 'string',
      readOnly: true,
      components: {
        input: EditorMessage,
      },
    },
    {
      name: 'growthExperiment',
      type: 'experimentGrowthbookPath',
      initialValue: {active: true},
    },
  ],
  preview: {
    select: {
      path: 'growthExperiment.default',
      experiment: 'growthExperiment.experimentId',
    },
    prepare({path, experiment}) {
      return {
        title: `${path} - ${experiment}`,
      }
    },
  },
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
export const formSchemaType = [form, formFields, experimentSettings, growthbookVariant]
