import {defineConfig, SanityClient} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {
  formSchemaType,
  eventSchemaTypes,
  articleSchemaTypes,
  personalisationSchemaTypes,
} from './schemaTypes'
import {structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {fieldLevelExperiments, launchDarklyFieldLevel} from '@sanity/personalization-plugin'
import {formSchema} from '@sanity/form-toolkit'
import {assist} from '@sanity/assist'

const getExperiments = async (client: SanityClient) => {
  const experiments = await client.fetch('*[_type == "experiments"]')
  return experiments
}

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? ''
export const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineConfig([
  {
    name: 'experiments',
    title: 'Day one with Sanity',
    basePath: '/experiments',
    projectId,
    dataset,

    plugins: [
      structureTool({structure, defaultDocumentNode}),
      visionTool(),
      fieldLevelExperiments({
        fields: ['string'],
        experiments: [
          {
            id: 'event-name',
            label: 'Event Name',
            variants: [
              {
                id: 'control',
                label: 'Control',
              },
              {
                id: 'variant',
                label: 'Variant',
              },
            ],
          },
        ],
      }),
      formSchema(),
    ],

    schema: {
      types: eventSchemaTypes,
    },
  },
  {
    name: 'Forms',
    title: 'Day one with Sanity(Forms)',
    basePath: '/forms',
    projectId,
    dataset,

    plugins: [
      structureTool(),
      visionTool(),
      fieldLevelExperiments({
        fields: ['formFields', 'path'],
        experiments: getExperiments,
      }),
      formSchema(),
    ],

    schema: {
      types: formSchemaType,
    },
  },

  {
    name: 'Launch',
    title: 'Day one with Sanity(LD)',
    basePath: '/Launch',
    projectId,
    dataset,
    plugins: [
      structureTool(),
      visionTool(),
      launchDarklyFieldLevel({
        projectKey: 'default',
        fields: ['string', 'text', 'image'],
      }),
      assist(),
    ],

    schema: {
      types: articleSchemaTypes,
    },
  },
  {
    name: 'Personalisation',
    title: 'Day one with Sanity(Personalisation)',
    basePath: '/personalisation',
    projectId,
    dataset,

    plugins: [
      structureTool(),
      visionTool(),
      fieldLevelExperiments({
        fields: ['image', 'text'],
        experimentNameOverride: 'audience',
        variantNameOverride: 'segment',
        experiments: [
          {
            id: 'status',
            label: 'UserStatus',
            variants: [
              {
                id: 'loggedIn',
                label: 'Logged In',
              },
              {
                id: 'anonymous',
                label: 'Anonymous',
              },
            ],
          },
        ],
      }),
      assist(),
    ],

    schema: {
      types: personalisationSchemaTypes,
    },
  },
])
