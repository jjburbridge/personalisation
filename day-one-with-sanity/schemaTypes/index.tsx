import {eventType} from './eventType'
import {artistType} from './artistType'
import {venueType} from './venueType'
import {experiments, variant} from './experiments'
import {Article} from './article'
import {path, routing} from './routing'
import {form, formFields} from './forms'
import {PersonalisationType} from './personalisation'

// const text = defineField({
//   name: 'textBlock',
//   type: 'object',
//   fields: [
//     {
//       name: 'text',
//       type: 'array',
//       of: [{type: 'block'}],
//     },
//   ],
// })

export const eventSchemaTypes = [artistType, eventType, venueType, formFields]
export const formSchemaType = [form, formFields, routing, path, experiments, variant]

export const articleSchemaTypes = [Article]

export const personalisationSchemaTypes = [PersonalisationType]
