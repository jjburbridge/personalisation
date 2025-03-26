import {defineConfig, SanityClient} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {formSchemaType, eventSchemaTypes, articleSchemaTypes} from './schemaTypes'
import {allStructure, structure, templatesByType} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {fieldLevelExperiments, launchDarklyFieldLevel} from '@sanity/personalization-plugin'
import {hubSpotInput, mailchimpInput, formSchema} from '@sanity/form-toolkit'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {assist} from '@sanity/assist'
import {workflow} from 'sanity-plugin-workflow'

const getExperiments = async (client: SanityClient) => {
  const experiments = await client.fetch('*[_type == "experiments"]')
  return experiments
}

const templates = () => {
  return formSchemaType.map((type) => {
    return templatesByType(type)
  })
}

export default defineConfig([
  {
    name: 'experiments',
    title: 'Day one with Sanity',
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
    title: 'Day one with Sanity(Forms)',
    basePath: '/personalisation',
    projectId: 'ikcwiihw',
    dataset: 'production',

    plugins: [
      structureTool(/* {
        structure: allStructure,
      } */),
      visionTool(),
      fieldLevelExperiments({
        fields: ['formFields', 'growthbookPath'],
        //   variantNameOverride: 'segment',
        //   experimentNameOverride: 'audience',
        //   // hardcoded experiments and variants
        experiments: getExperiments,
        // experiments: [
        //   {
        //     id: 'event-name',
        //     label: 'Event Name',
        //     variants: [
        //       {
        //         id: 'control',
        //         label: 'Control',
        //       },
        //       {
        //         id: 'variant',
        //         label: 'Variant',
        //       },
        //     ],
        //   },
        //   {
        //     id: 'artist-form',
        //     label: 'Artist Form',
        //     variants: [
        //       {
        //         id: 'native',
        //         label: 'Native',
        //       },
        //       {
        //         id: 'hubspot',
        //         label: 'Hubspot',
        //       },
        //       {
        //         id: 'mailchimp',
        //         label: 'mailchimp',
        //       },
        //     ],
        //   },
        // ],
      }),
      // //     internationalizedArray({
      // //       languages: [
      // //         {id: 'en', title: 'English'},
      // //         {id: 'no', title: 'Norwegian'},
      // //       ],
      // //       defaultLanguages: ['en'],
      // //       fieldTypes: ['string', 'textBlock'],
      // //     }),
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
      // templates,
    },
  },

  {
    name: 'Launch',
    title: 'Day one with Sanity(Launch)',
    basePath: '/Launch',
    projectId: 'ikcwiihw',
    dataset: 'production',

    plugins: [
      structureTool(),
      visionTool(),
      launchDarklyFieldLevel({
        // environment: 'production',
        projectKey: 'default',
        fields: ['string', 'image'],
      }),
      // LaunchFieldLevel({
      //   environment: 'production',
      //   fields: ['formFields', 'growthbookPath'],
      // }),
      assist(),
      // hubSpotInput({
      //   url: 'https://async-list-test-studio.sanity.dev/api/hubspot',
      // }),
      // mailchimpInput({
      //   url: 'https://async-list-test-studio.sanity.dev/api/mailchimp',
      // }),
      // formSchema(),
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
      types: articleSchemaTypes,
    },
  },
])
