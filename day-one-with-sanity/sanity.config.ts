import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {formSchemaType, eventSchemaTypes} from './schemaTypes'
import {structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {fieldLevelExperiments /* fieldLevelPersonalisation */} from '@sanity/personalization-plugin'
import {hubSpotInput, mailchimpInput, formSchema} from '@sanity/form-toolkit'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'

export default defineConfig([
  {
    name: 'experiments',
    title: 'Day one with Sanity(Experiments)',
    basePath: '/experiments',
    projectId: 'ikcwiihw',
    dataset: 'production',

    plugins: [
      structureTool({structure, defaultDocumentNode}),
      visionTool(),
      fieldLevelExperiments({
        // field types that you want to be able to emperiment on
        fields: ['string', 'textBlock'],
        // objectNameOverride: 'variant',
        // fieldNameOverride: 'experiment',
        // hardcoded experiments and variants
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
          {
            id: 'artist-form',
            label: 'Artist Form',
            variants: [
              {
                id: 'native',
                label: 'Native',
              },
              {
                id: 'hubspot',
                label: 'Hubspot',
              },
              {
                id: 'mailchimp',
                label: 'mailchimp',
              },
            ],
          },
        ],
      }),
      internationalizedArray({
        languages: [
          {id: 'en', title: 'English'},
          {id: 'no', title: 'Norwegian'},
        ],
        defaultLanguages: ['en'],
        fieldTypes: ['string', 'textBlock'],
      }),
      hubSpotInput({
        url: 'https://async-list-test-studio.sanity.dev/api/hubspot',
      }),
      mailchimpInput({
        url: 'https://async-list-test-studio.sanity.dev/api/mailchimp',
      }),
      formSchema(),
      // fieldLevelPersonalisation({
      //   fields: ['string'],
      //   variants: [
      //     {
      //       id: 'guest',
      //       label: 'Guest',
      //     },
      //     {
      //       id: 'member',
      //       label: 'Member',
      //     },
      //   ],
      // }),
    ],

    schema: {
      types: eventSchemaTypes,
    },
  },
  {
    name: 'personalisation',
    title: 'Day one with Sanity(Personalisation)',
    basePath: '/personalisation',
    projectId: 'ikcwiihw',
    dataset: 'production',

    plugins: [
      structureTool(),
      visionTool(),
      fieldLevelExperiments({
        fields: ['formFields'],
        //   variantNameOverride: 'segment',
        //   experimentNameOverride: 'audience',
        //   // hardcoded experiments and variants
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
          {
            id: 'artist-form',
            label: 'Artist Form',
            variants: [
              {
                id: 'native',
                label: 'Native',
              },
              {
                id: 'hubspot',
                label: 'Hubspot',
              },
              {
                id: 'mailchimp',
                label: 'mailchimp',
              },
            ],
          },
        ],
      }),
      //     internationalizedArray({
      //       languages: [
      //         {id: 'en', title: 'English'},
      //         {id: 'no', title: 'Norwegian'},
      //       ],
      //       defaultLanguages: ['en'],
      //       fieldTypes: ['string', 'textBlock'],
      //     }),
      hubSpotInput({
        url: 'https://async-list-test-studio.sanity.dev/api/hubspot',
      }),
      mailchimpInput({
        url: 'https://async-list-test-studio.sanity.dev/api/mailchimp',
      }),
      formSchema(),
      //     // fieldLevelPersonalisation({
      //     //   fields: ['string'],
      //     //   variants: [
      //     //     {
      //     //       id: 'guest',
      //     //       label: 'Guest',
      //     //     },
      //     //     {
      //     //       id: 'member',
      //     //       label: 'Member',
      //     //     },
      //     //   ],
      //     // }),
    ],

    schema: {
      types: formSchemaType,
    },
  },
])
