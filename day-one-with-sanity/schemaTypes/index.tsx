import {eventType} from './eventType'
import {artistType} from './artistType'
import {venueType} from './venueType'
import {
  defineArrayMember,
  defineField,
  defineType,
  ObjectItemProps,
  Path,
  PreviewLayoutKey,
  PreviewProps,
  useClient,
  useFormValue,
} from 'sanity'
import {ArraySearch} from './components/ArrarySearch'
import {useCallback, useState} from 'react'
import {useEffect} from 'react'
import {Card, Flex, Text} from '@sanity/ui'

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
    // {
    //   name: 'hubspot',
    //   type: 'hubSpotForm',
    // },
    // {
    //   name: 'mailchimp',
    //   type: 'mailchimpForm',
    // },
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
    defineField({
      name: 'workspaceId',
      type: 'string',
    }),
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
    defineField({
      name: 'workspaceId',
      type: 'string',
    }),
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

const variant = defineType({
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

const experiments = defineType({
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
    defineField({
      name: 'workspaceId',
      type: 'string',
    }),
  ],
})

export const Article = defineType({
  type: 'document',
  name: 'Article',
  title: 'Article Document',
  fields: [
    defineField({
      type: 'string',
      name: 'Title',
      title: 'Article Title',
      validation: (e) => e.required(),
    }),
    defineField({
      type: 'experimentImage',
      name: 'FeatureImage',
      title: 'Feature Image',
    }),
    defineField({type: 'text', name: 'description', title: 'Description'}),
    defineField({
      type: 'array',
      name: 'Content',
      title: 'Article Content',
      validation: (e) => e.required(),
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({type: 'date', name: 'PublishDate', title: 'Publish Date'}),

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
    defineField({
      type: 'array',
      name: 'nestedContent',
      title: 'Nested Content',
      of: [
        {
          type: 'object',
          name: 'level1',
          title: 'Level 1',
          fields: [
            {
              type: 'string',
              name: 'level1Title',
              title: 'Level 1 Title',
            },
            {
              type: 'array',
              name: 'level2Items',
              title: 'Level 2 Items',
              of: [
                {
                  type: 'object',
                  name: 'level2',
                  title: 'Level 2',
                  fields: [
                    {
                      type: 'string',
                      name: 'level2Title',
                      title: 'Level 2 Title',
                    },
                    {
                      type: 'array',
                      name: 'level3Items',
                      title: 'Level 3 Items',
                      of: [
                        {
                          type: 'object',
                          name: 'level3',
                          title: 'Level 3',
                          fields: [
                            {
                              type: 'string',
                              name: 'level3Title',
                              title: 'Level 3 Title',
                            },
                            {
                              type: 'text',
                              name: 'level3Content',
                              title: 'Level 3 Content',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      components: {
        item: (props: ObjectItemProps) => {
          console.log('item', {props})
          // * add state for handling opening via click
          const [open, setOpen] = useState(true)
          const onClose = useCallback(() => setOpen(false), [])
          const onOpen = useCallback(() => setOpen(true), [])

          // get parent path by removing last path item
          const parentPath = props.path.slice(0, -1) as Path
          const arrayLength = (useFormValue(parentPath) as [])?.length
          // if item is not last return true for a border bottom
          const hasBorderBottom = props.index !== arrayLength - 1

          return (
            <Card>
              {/* This will render the item plus the preview component, which will only render a spec title from a hidden field */}
              <Card onClick={!open ? onOpen : onClose} margin={2}>
                {props.renderDefault({
                  ...props,
                  onOpen: () => (!open ? onOpen : onClose),
                  // * prevent the default input from opening the modal when focusing on inline inputs
                  open: false,
                })}
              </Card>
              {/* conditionally render the object input */}
              {open && (
                <Card paddingX={6} paddingBottom={6} borderBottom={hasBorderBottom}>
                  {props.children}
                </Card>
              )}
            </Card>
          )
        },
        preview: (previewProps: PreviewProps<PreviewLayoutKey>) => (
          <Flex justify={'flex-start'} gap={6} paddingY={2}>
            <Text weight="semibold">
              {/* we use the preview value for title and render a item header so to speak */}
              {previewProps.title as string}
            </Text>
            <Text muted weight="semibold">
              {/* we use the preview value for subtitle for a bit more info */}
              {previewProps.subtitle as string}
            </Text>
          </Flex>
        ),
      },
    }),

    defineField({
      type: 'array',
      name: 'related',
      title: 'Related',
      description: 'list of references to other articles',
      of: [defineArrayMember({type: 'reference', to: [{type: 'Article'}]})],
    }),
  ],
  preview: {
    select: {
      title: 'Title',
      subtitle: 'PublishDate',
      media: 'FeatureImage.default',
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
export const formSchemaType = [
  form,
  formFields,
  experimentSettings,
  growthbookVariant,
  experiments,
  variant,
]

export const articleSchemaTypes = [Article]
