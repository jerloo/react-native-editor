import _ from 'lodash'

import { ROW_TYPES, STYLE_TYPES } from './Constants'
import { generateId, parseRawBlock } from './Helpers'
import {
  ContentBlock,
  ContentInlineStyle,
  ContentRow,
  ContentState,
} from './models'

export const convertToMarkdown = ({ rows = [] }: { rows: ContentRow[] }) => {
  let markdown = ''

  rows.forEach((row) => {
    const { blocks = [], type } = row

    if (!row.value) {
      markdown += `\n\n`
    }

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]

      let { text: blockText = '', styles = [] } = block

      if (!blockText || !blockText.length || blockText === '') {
        continue
      }

      styles = _.uniq(styles)

      if (
        styles.includes(STYLE_TYPES.BOLD) &&
        styles.includes(STYLE_TYPES.ITALIC) &&
        styles.includes(STYLE_TYPES.UNDERLINE)
      ) {
        blockText = `__***${blockText}***__`
      } else if (
        styles.includes(STYLE_TYPES.BOLD) &&
        styles.includes(STYLE_TYPES.ITALIC)
      ) {
        blockText = `***${blockText}***`
      } else if (
        styles.includes(STYLE_TYPES.BOLD) &&
        styles.includes(STYLE_TYPES.UNDERLINE)
      ) {
        blockText = `__**${blockText}**__`
      } else if (
        styles.includes(STYLE_TYPES.ITALIC) &&
        styles.includes(STYLE_TYPES.UNDERLINE)
      ) {
        blockText = `__*${blockText}*__`
      } else if (styles.includes(STYLE_TYPES.BOLD) && styles.length === 1) {
        blockText = `**${blockText}**`
      } else if (styles.includes(STYLE_TYPES.ITALIC) && styles.length === 1) {
        blockText = `*${blockText}*`
      } else if (
        styles.includes(STYLE_TYPES.UNDERLINE) &&
        styles.length === 1
      ) {
        blockText = `__${blockText}__`
      }

      if (type === ROW_TYPES.HEADING1) {
        blockText = `# ${blockText}`
      } else if (type === ROW_TYPES.HEADING2) {
        blockText = `## ${blockText}`
      } else if (type === ROW_TYPES.HEADING3) {
        blockText = `### ${blockText}`
      } else if (type === ROW_TYPES.BULLETS) {
        blockText = `* ${blockText}`
      } else if (type === ROW_TYPES.BLOCKQUOTE) {
        blockText = `> ${blockText}`
      }

      markdown += blockText

      if (blocks.length - 1 === i) {
        markdown += `\n\n`
      }
    }
  })

  console.log(markdown)

  return markdown
}

export const convertFromRaw = ({
  contentState,
}: {
  contentState: ContentState
}) => {
  const { blocks = [] } = contentState

  const result: ContentRow[] = []

  blocks.forEach((block) => {
    const { row, text, type } = parseRawBlock(block)
    result.push({ id: generateId(), type, value: text, blocks: row })
  })

  // console.log(result)

  return result
}

export const convertToRaw = ({ rows = [] }: { rows: ContentRow[] }) => {
  const result: ContentState = { blocks: [], entityMap: {} }

  const sample = {
    key: '1la1e',
    text: '',
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
  }

  rows.forEach((row) => {
    // console.log(item)
    // const { row, text, type } = parseRow(item)
    // result.push({ id: generateId(), type, value: text, blocks: row })

    const item: ContentBlock = {
      ...sample,
      key: generateId(),
      text: row.value,
      inlineStyleRanges: [],
      styles: [],
      blocks: [],
    }

    let type = 'unstyled'

    if (row.type === ROW_TYPES.BULLETS) {
      type = 'unordered-list-item'
    }

    if (row.type === ROW_TYPES.NUMBERS) {
      type = 'ordered-list-item'
    }

    item.type = type

    let rangeIndex = 0

    ;(row.blocks || []).forEach((block) => {
      const offset = rangeIndex
      rangeIndex += block.text?.length || 0

      const blockStyles = block.styles || []

      for (let i = 0; i < blockStyles.length; i++) {
        const style = blockStyles[i]

        const inlineStyleRange: ContentInlineStyle = {
          offset: offset,
          length: block.text?.length || 0,
          style: style.toUpperCase(),
        }
        item.inlineStyleRanges?.push(inlineStyleRange)
      }
      //
    })

    result.blocks.push(item)
  })

  // console.log(JSON.stringify(result))

  return result
}
