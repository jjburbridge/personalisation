import { defineType } from "sanity"

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

export const path = defineType({
  name: 'path',
  type: 'string',
  validation: (Rule) =>
    Rule.required().custom(async (value: string | undefined, context) => {
      if (!value) return true
      if (!value.startsWith('/')) return 'Must start with "/"'
      return true
    }),
})

export const routing = defineType({
  name: 'routing',
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
      name: 'pathExperiment',
      type: 'experimentPath',
      initialValue: {active: true},
    },
  ],
  preview: {
    select: {
      path: 'pathExperiment.default',
      experiment: 'pathExperiment.experimentId',
    },
    prepare({path, experiment}) {
      return {
        title: `${path} - ${experiment}`,
      }
    },
  },
})
