import {defineType, defineField} from 'sanity'

export const formFields = defineField({
  name: 'formFields',
  type: 'object',
  fields: [{name: 'native', type: 'reference', to: [{type: 'form'}]}],
})

export const form = defineType({
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
    defineField({
      name: 'workspaceId',
      type: 'string',
    }),
  ],
})
