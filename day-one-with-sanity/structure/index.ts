import type {StructureResolver} from 'sanity/structure'
import {CalendarIcon, UsersIcon, PinIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.listItem()
        .title('Upcoming Events')
        .schemaType('event')
        .icon(CalendarIcon)
        .child(S.documentList().title('Upcoming Events').filter('date > now()')),
      S.listItem()
        .title('Past Events')
        .schemaType('event')
        .icon(CalendarIcon)
        .child(S.documentList().title('Past Events').filter('date < now()')),
      S.divider(),
      S.documentTypeListItem('artist').title('Artists').icon(UsersIcon),
      S.documentTypeListItem('venue').title('Venues').icon(PinIcon),
      S.listItem()
        .title('Dictionary')
        .schemaType('dictionary')
        .id('dictionary')
        .icon(PinIcon)
        .child(S.document().schemaType('dictionary').documentId('dictionary')),
    ])

// @ts-ignore
export const myStructureUvA = (S, workspaceId) =>
  S.list()
    .title(workspaceId)
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.documentList()
            .title('Site Settings')
            .filter('_type == "settings" && workspaceId == $workspaceId')
            .params({workspaceId}),
        ),
      S.divider(),
      // @ts-ignore
      ...S.documentTypeListItems()
        // @ts-ignore
        .filter((listItem) => !['settings'].includes(listItem.getId()))
        // @ts-ignore
        .map((listItem) =>
          S.listItem()
            .title(listItem.getTitle())
            .id(listItem.getId())
            .icon(listItem.getSchemaType().icon || undefined)
            .child(
              S.documentTypeList(listItem.getId())
                .title(listItem.getTitle())
                .filter('_type == $type && workspaceId == $workspaceId')
                .params({type: listItem.getId(), workspaceId})
                .initialValueTemplates([
                  S.initialValueTemplateItem(`${listItem.getId()}-by-workspace`, {
                    workspaceId,
                  }),
                ]),
            ),
        ),
    ])

export const AllDocs = (S) =>
  S.list()
    .title('All')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.documentList().title('Site Settings').filter('_type == "settings"')),
      S.divider(),
      // @ts-ignore
      ...S.documentTypeListItems()
        // @ts-ignore
        .filter((listItem) => !['settings'].includes(listItem.getId()))
        // @ts-ignore
        .map((listItem) =>
          S.listItem()
            .title(listItem.getTitle())
            .id(listItem.getId())
            .icon(listItem.getSchemaType().icon || undefined)
            .child(
              S.documentTypeList(listItem.getId())
                .title(listItem.getTitle())
                .filter('_type == $type'),
            ),
        ),
    ])

// @ts-ignore
export const structureSection = (S, sectionId) => {
  return myStructureUvA(S, sectionId)
}
export const myStructureSection = (S, workspaceId) =>
  S.list()
    .title('Sections')
    .items([
      // Base folder to show all documents
      S.listItem().title(workspaceId).child(myStructureUvA(S, workspaceId)),
      ...getSectionListItems(S, workspaceId),
    ])

// Function to fetch sections and return them as individual list items (folders)
// @ts-ignore
const getSectionListItems = (S, workspaceId) => {
  return S.listItem().title(`All ${workspaceId}`).child(structureSection(S, workspaceId))
}

const SECTIONS = [
  {
    _id: 'section-1',
    title: 'Section 1',
  },
  {
    _id: 'section-2',
    title: 'Section 2',
  },
  {
    _id: 'section-3',
    title: 'Section 3',
  },
]

const createAllSectionsItems = (S: StructureBuilder, config: ConfigContext) =>
  SECTIONS.map((section) => getSectionListItems(S, section._id))

export const allStructure = (S, context) => {
  return S.list()
    .id('root')
    .title('Markets')
    .items([...createAllSectionsItems(S, context), S.listItem().title('All').child(AllDocs(S))])
}

export const templatesByType = ({name}) => ({
  id: `${name}-by-workspace`,
  title: `${name} by Category`,
  schemaType: name, // Must be a valid schema type
  parameters: [{name: 'workspaceId', type: 'string'}], // Must be a valid schema type
  value: (params) => {
    return {
      workspaceId: params.workspaceId,
    }
  },
})
