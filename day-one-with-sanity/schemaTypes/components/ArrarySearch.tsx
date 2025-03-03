import {TextInput} from '@sanity/ui'
import {SearchIcon} from '@sanity/icons'
import {useState} from 'react'
import {ArrayOfObjectsInputProps} from 'sanity'
import Fuse from 'fuse.js'

export const ArraySearch = (props: ArrayOfObjectsInputProps) => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  const options = {
    includeScore: true,
    keys: [
      'item.value.title',
      'item.value.key',
      'item.value.description',
      'item.value.string.value',
    ],
  }

  const fuse = new Fuse(props.members, options)
  const filteredItems = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : props.members
  const newProps = {
    ...props,
    members: filteredItems,
  }

  return (
    <>
      <TextInput
        value={searchQuery}
        onChange={(event: any) => setSearchQuery(event.currentTarget.value)}
        icon={SearchIcon}
      />
      {props.renderDefault(newProps)}
    </>
  )
}
