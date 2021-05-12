import _ from 'lodash'
import shortid from 'shortid'

import { ROW_TYPES, STYLE_TYPES } from './Constants'
import { ContentBlock, ContentRow, ContentState, Selection } from './models'

export const generateId = () => shortid()

export const contentState: ContentState = {
  blocks: [
    {
      key: '1la1e',
      text: 'thi wil contain bold',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [{ offset: 16, length: 4, style: 'BOLD' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '5bl2j',
      text: 'thi wil contain italic',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [{ offset: 16, length: 6, style: 'ITALIC' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '9sen6',
      text: 'thi wil contain underline',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [{ offset: 16, length: 9, style: 'UNDERLINE' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: 'a11h3',
      text: 'thi wil contain bold italic',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 16, length: 4, style: 'BOLD' },
        { offset: 21, length: 6, style: 'BOLD' },
        { offset: 21, length: 6, style: 'ITALIC' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '3g7tj',
      text: 'thi wil contain bold underline',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 16, length: 4, style: 'BOLD' },
        { offset: 21, length: 9, style: 'UNDERLINE' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: 'o4sp',
      text: 'thi wil contain italic underline',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 16, length: 6, style: 'BOLD' },
        { offset: 23, length: 9, style: 'UNDERLINE' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: 'dtmbt',
      text: 'thi wil contain bold italic underline',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 16, length: 4, style: 'BOLD' },
        { offset: 21, length: 6, style: 'ITALIC' },
        { offset: 28, length: 9, style: 'UNDERLINE' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '596kp',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '8jtu1',
      text: 'combine bolditalic',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 8, length: 10, style: 'BOLD' },
        { offset: 12, length: 6, style: 'ITALIC' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '86phc',
      text: 'combine boldunderline',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 8, length: 13, style: 'BOLD' },
        { offset: 12, length: 9, style: 'UNDERLINE' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '69jv4',
      text: 'combine italicunderline',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 8, length: 6, style: 'ITALIC' },
        { offset: 14, length: 9, style: 'UNDERLINE' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: 'kpe8',
      text: 'combine bolditalicunderline',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [
        { offset: 8, length: 4, style: 'BOLD' },
        { offset: 12, length: 6, style: 'ITALIC' },
        { offset: 18, length: 9, style: 'UNDERLINE' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '292du',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '6g2mu',
      text: 'test ',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 5, style: 'UNDERLINE' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: 'a2fp3',
      text: 'asdasdasda s',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 12, style: 'UNDERLINE' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '4u38f',
      text: 'asd asd',
      type: 'unordered-list-item',
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 7, style: 'UNDERLINE' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '28gr5',
      text: '',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '2tjri',
      text: 'test ',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 5, style: 'UNDERLINE' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: '8oduf',
      text: 'asda sd',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 7, style: 'UNDERLINE' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: 'dtld2',
      text: 'asdasdd ',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [{ offset: 0, length: 8, style: 'UNDERLINE' }],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
    {
      key: 'dhfar',
      text: 'asd dasd asd',
      type: 'ordered-list-item',
      depth: 0,
      inlineStyleRanges: [
        { offset: 0, length: 12, style: 'UNDERLINE' },
        { offset: 4, length: 4, style: 'ITALIC' },
        { offset: 10, length: 2, style: 'BOLD' },
      ],
      entityRanges: [],
      data: {},
      styles: [],
      blocks: [],
    },
  ],
  entityMap: {},
}

export const createContentStateFromText = (
  text: string,
  delimiter?: string
): ContentState => {
  const lines = text.split(delimiter || '\n')
  return {
    blocks: lines.map((line) => {
      return {
        text: line,
      }
    }),
    entityMap: {},
  }
}

export const createEmptyContentState = (): ContentState => {
  return {
    blocks: [],
    entityMap: {},
  }
}

const getBlockType = (type?: string) => {
  if (type === 'unordered-list-item') {
    return ROW_TYPES.BULLETS
  }

  if (type === 'ordered-list-item') {
    return ROW_TYPES.NUMBERS
  }

  return ROW_TYPES.TEXT
}

export const parseRawBlock = (block: ContentBlock) => {
  const { text, inlineStyleRanges, type } = block

  if (!text || !text.length) {
    return { row: [{ text: '' }], type: getBlockType(type), text: '' }
  }
  const result: ContentBlock[] = []

  let styleOffsets: any[] = []

  inlineStyleRanges?.forEach((inlineStyleRange: any) => {
    styleOffsets.push(inlineStyleRange.offset)
    styleOffsets.push(inlineStyleRange.length + inlineStyleRange.offset)
  })

  styleOffsets = styleOffsets.filter((item, pos) => {
    return styleOffsets.indexOf(item) === pos
  })

  styleOffsets.sort((a, b) => a - b)

  const firstIndex = styleOffsets[0]
  if (firstIndex > 0) {
    const item = {
      text: text.substring(0, firstIndex),
    }
    result.push(item as ContentBlock)
  }

  styleOffsets.forEach((a, index) => {
    const b = styleOffsets[index + 1]
    if (b) {
      const item: ContentBlock = {
        styles: [],
        text: '',
      }

      inlineStyleRanges?.forEach((inlineStyleRange: any) => {
        const start = inlineStyleRange.offset
        const end = inlineStyleRange.length + inlineStyleRange.offset

        if (start >= a && b <= end) {
          item.text = text.substring(a, b)
          if (inlineStyleRange.style) {
            item.styles?.push(inlineStyleRange.style.toLowerCase())
          }
        }
      })

      result.push(item as ContentBlock)
    }
  })

  const lastIndex = styleOffsets[styleOffsets.length - 1]
  if (lastIndex < text.length) {
    const item = {
      text: text.substring(lastIndex, text.length),
    }
    result.push(item)
  }

  if (!inlineStyleRanges?.length) {
    const item = { row: [{ text: text }], type: getBlockType(type), text: text }
    result.push(item)
  }

  return { row: result, text, type: getBlockType(type) }
}

export const getRowValueFromBlocks = ({ row = {} }) => {
  const { blocks = [] } = row as any
  return blocks.map((item: any) => item.text).join('')
}

export const getCurrentBlockInRow = ({
  selection,
  row,
  cursorAt = null,
}: {
  selection?: Selection
  row: ContentRow
  cursorAt?: number | null
}) => {
  if (cursorAt === null && selection?.id !== row.id) {
    return {}
  }

  let rowCursorAt = cursorAt !== null ? cursorAt : selection?.start

  let currentBlock: ContentBlock = {
    text: '',
  }
  let blockIndex: number = -1
  let pointerAt: number = -1
  let position = null

  const { blocks = [] } = row

  const value = getRowValueFromBlocks({ row })

  // Cursor is At the Beginning
  if (rowCursorAt === 0) {
    currentBlock = blocks[0] || { text: '' }
    blockIndex = 0
    pointerAt = 0
    position = 'start'
  } else if (rowCursorAt === value.length) {
    // Cursor is At the End
    const lastBlockIndex = blocks.length - 1
    currentBlock = blocks[lastBlockIndex] || { text: '' }
    blockIndex = lastBlockIndex
    pointerAt = (currentBlock.text || '').length
    position = 'end'
  } else {
    position = 'middle'
    // Cursor is at middle text
    const textBeforePointer = value.substring(0, rowCursorAt)

    let blockTexts = ''

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] || {}

      const { text: blockText = '' } = block
      blockTexts += blockText

      if (blockTexts.length >= textBeforePointer.length) {
        currentBlock = block
        blockIndex = i

        // const textLengthAfterPointerInBlock = blockTexts.length - textBeforePointer.length
        const textLengthAfterPointerInBlock = blockTexts.substring(
          textBeforePointer.length,
          blockTexts.length
        ).length
        pointerAt = blockText.length - textLengthAfterPointerInBlock
        break
      }
    }

    // console.log("Cursor is At middle text::", pointerAt)
  }

  return {
    block: currentBlock,
    blockIndex,
    pointerAt,
    position,
    styles: [],
  }
}

export const getSelectedBlocks = ({
  selection,
  row,
}: {
  selection: Selection
  row: ContentRow
}) => {
  const { start = 0, end = 0 } = selection
  const startBlock = getCurrentBlockInRow({ row, cursorAt: start })
  const endBlock = getCurrentBlockInRow({ row, cursorAt: end })
  return { startBlock, endBlock }
}

export const splitString = (value = '', index: number) => [
  value.substring(0, index),
  value.substring(index),
]

// FIXME: re-write
export const mergeNewStyles = (
  currentStyles: string[] = [],
  newStyles: string[] = [],
  oldStyles: string[] = []
) => {
  let styles = currentStyles // _.uniq(currentStyles)

  // console.tron.display({
  //   name: 'mergeNewStyles',
  //   value: { currentStyles, newStyles, oldStyles },
  // })

  if (
    oldStyles.includes(STYLE_TYPES.BOLD) &&
    !newStyles.includes(STYLE_TYPES.BOLD)
  ) {
    styles = styles.filter((i) => i !== STYLE_TYPES.BOLD)
  }

  if (
    oldStyles.includes(STYLE_TYPES.ITALIC) &&
    !newStyles.includes(STYLE_TYPES.ITALIC)
  ) {
    styles = styles.filter((i) => i !== STYLE_TYPES.ITALIC)
  }

  if (
    oldStyles.includes(STYLE_TYPES.UNDERLINE) &&
    !newStyles.includes(STYLE_TYPES.UNDERLINE)
  ) {
    styles = styles.filter((i) => i !== STYLE_TYPES.UNDERLINE)
  }

  if (
    oldStyles.includes(STYLE_TYPES.STRIKETHROUGH) &&
    !newStyles.includes(STYLE_TYPES.STRIKETHROUGH)
  ) {
    styles = styles.filter((i) => i !== STYLE_TYPES.STRIKETHROUGH)
  }

  if (
    oldStyles.includes(STYLE_TYPES.CODE) &&
    !newStyles.includes(STYLE_TYPES.CODE)
  ) {
    styles = styles.filter((i) => i !== STYLE_TYPES.CODE)
  }

  if (
    oldStyles.includes(STYLE_TYPES.LINK) &&
    !newStyles.includes(STYLE_TYPES.LINK)
  ) {
    styles = styles.filter((i) => i !== STYLE_TYPES.LINK)
  }

  styles = [...styles, ...newStyles]

  styles = _.uniq(styles)

  return styles
}

export const attachStylesToSelectedText = ({
  selection,
  row,
  newStyles,
  oldStyles,
}: {
  selection: any
  row: any
  newStyles: string[]
  oldStyles: string[]
}) => {
  const { startBlock, endBlock } = getSelectedBlocks({ selection, row })
  if (startBlock === null || endBlock === null) return

  const { blocks } = row

  let selectedText = ''

  const newBlocks = []

  for (let i = 0; i < blocks.length; i++) {
    if (i >= startBlock.blockIndex! && i <= endBlock.blockIndex!) {
      const block = blocks[i]
      const { text } = block

      let blockText = text
      let textParts: string[]

      if (startBlock.blockIndex === endBlock.blockIndex) {
        const blockPrevText = text.substring(0, startBlock.pointerAt)
        const blockSelectedText = text.substring(
          startBlock.pointerAt,
          endBlock.pointerAt
        )
        const blockNextText = text.substring(endBlock.pointerAt, text.length)

        console.log(
          'Same blog',
          blockSelectedText,
          startBlock.pointerAt,
          endBlock.pointerAt
        )

        const { styles: currentStyles = [] } = block

        const prevBlock = { text: blockPrevText, styles: currentStyles }
        const newBlock = {
          text: blockSelectedText,
          styles: mergeNewStyles(currentStyles, newStyles, oldStyles),
        }
        const nextBlock = { text: blockNextText, styles: currentStyles }

        newBlocks.push(prevBlock)
        newBlocks.push(newBlock)
        newBlocks.push(nextBlock)
      } else if (i === startBlock.blockIndex) {
        textParts = splitString(text, startBlock.pointerAt)
        const { styles: currentStyles = [] } = block
        const prevBlock = { text: textParts[0], styles: currentStyles }
        const newBlock = {
          text: textParts[1],
          styles: mergeNewStyles(currentStyles, newStyles, oldStyles),
        }
        newBlocks.push(prevBlock)
        newBlocks.push(newBlock)
      } else if (i === endBlock.blockIndex) {
        blockText = text.substring(0, endBlock.pointerAt)
        textParts = splitString(text, endBlock.pointerAt)
        const { styles: currentStyles = [] } = block
        const newBlock = {
          text: textParts[0],
          styles: mergeNewStyles(currentStyles, newStyles, oldStyles),
        }
        const nextBlock = { text: textParts[1], styles: currentStyles }
        newBlocks.push(newBlock)
        newBlocks.push(nextBlock)
      } else {
        blockText = text
        const { styles: currentStyles = [] } = block
        const newBlock = {
          text: text,
          styles: mergeNewStyles(currentStyles, newStyles, oldStyles),
        }
        newBlocks.push(newBlock)
      }

      selectedText += blockText
      console.log('selectedText', selectedText)
    }
  }

  let p1 = blocks.slice(0, startBlock.blockIndex)
  let p2 = blocks.slice(endBlock.blockIndex! + 1)

  // if (startBlock.blockIndex === endBlock.blockIndex) {

  // }

  const data = [...p1, ...newBlocks, ...p2].filter(
    (item) => !!item.text && item.text.length > 0
  )

  // blocks.splice(startBlock.blockIndex, endBlock.blockIndex-startBlock.blockIndex+1);

  // console.tron.display({
  //   name: 'newBlocks',
  //   value: { newBlocks, selectedText, blocks, data, startBlock, endBlock },
  // })

  return { blocks: data }
}

export const removeSelectedText = ({
  selection,
  row,
}: {
  selection: Selection
  row: ContentRow
}) => {
  const { blocks = [], value = '' } = row

  if (selection.end - selection.start === value.length) {
    return []
  }

  const { startBlock, endBlock } = getSelectedBlocks({ selection, row })
  if (startBlock === null || endBlock === null) return []

  // console.tron.display({
  //   name: 'removeSelectedText',
  //   value: { startBlock, endBlock },
  // })

  const newBlocks: ContentBlock[] = []

  let p1 = blocks.slice(0, startBlock.blockIndex)
  let p2 = blocks.slice(endBlock.blockIndex! + 1)

  for (let i = 0; i < blocks.length; i++) {
    if (i >= startBlock.blockIndex! && i <= endBlock.blockIndex!) {
      const block = blocks[i]

      const { text = '', styles: currentStyles = [] } = block
      // let blockText = text
      let textParts: string[]
      if (startBlock.blockIndex === endBlock.blockIndex) {
        let blockPrevText = text.substring(0, startBlock.pointerAt)
        if (startBlock.pointerAt === text.length) {
          blockPrevText = text.slice(0, -1)
        }
        const prevBlock: ContentBlock = {
          text: blockPrevText,
          styles: currentStyles,
          key: '',
          type: '',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: null,
          blocks: [],
        }
        newBlocks.push(prevBlock)
      } else if (i === startBlock.blockIndex) {
        textParts = splitString(text, startBlock.pointerAt)
        const { styles: currentStyles = [] } = block
        const prevBlock: ContentBlock = {
          text: textParts[0],
          styles: currentStyles,
          key: '',
          type: '',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: null,
          blocks: [],
        }
        newBlocks.push(prevBlock)
      } else if (i === endBlock.blockIndex) {
        // blockText = text.substring(0, endBlock.pointerAt)
        textParts = splitString(text, endBlock.pointerAt)
        const { styles: currentStyles = [] } = block
        const nextBlock: ContentBlock = {
          text: textParts[1],
          styles: currentStyles,
          key: '',
          type: '',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: null,
          blocks: [],
        }
        newBlocks.push(nextBlock)
      } else {
        //   blockText = text
        //   const { styles: currentStyles = [] } = block
        //   const newBlock = { text: text, styles: [ ...currentStyles, ...newStyles ] }
        // newBlocks.push(newBlock)
      }

      // selectedText += blockText
    }
  }

  if (startBlock.blockIndex === endBlock.blockIndex) {
    console.log('Deleted one character')
  }

  const data = [...p1, ...newBlocks, ...p2].filter((i) => !!i.text)

  return data
}

export const splitRow = ({ row, selection }: any) => {
  if (selection.id !== row.id) {
    return
  }

  let rows = []

  const { type, align = 'auto', blocks = [] } = row

  const value = getRowValueFromBlocks({ row })

  const rowBlocks = blocks.filter((item: any) => item.text)

  const textParts = splitString(value, selection.start)

  const row1 = { id: generateId(), value: textParts[0], type, align } as any
  const row2 = { id: generateId(), value: textParts[1], type, align } as any

  const currentBlock = getCurrentBlockInRow({ row, selection })
  if (currentBlock === null) return

  let blockTexts = ''
  for (let i = 0; i < rowBlocks.length; i++) {
    const block = rowBlocks[i]
    blockTexts += block.text
    if (blockTexts.length >= row1.value.length) {
      let row1Blocks =
        rowBlocks.filter((item: any, index: number) => index < i) || []

      const blockTextParts = splitString(block.text, currentBlock.pointerAt!)

      if (blockTextParts[0]) {
        row1Blocks.push({ text: blockTextParts[0], styles: block.styles })
      }

      let row2Blocks =
        rowBlocks.filter((item: any, index: number) => index > i) || []
      if (blockTextParts[1]) {
        row2Blocks.unshift({ text: blockTextParts[1], styles: block.styles })
      }

      row1.blocks = row1Blocks.filter((item: any) => item.text)
      row2.blocks = row2Blocks.filter((item: any) => item.text)

      break
    }
  }

  rows = [row1, row2]

  // console.tron.display({
  //   name: 'rows',
  //   value: { props: rows },
  // })

  return rows
}

export const insertAt = (
  main_string: string,
  ins_string: string,
  pos: number
) => {
  if (typeof pos === 'undefined') {
    pos = 0
  }
  if (typeof ins_string === 'undefined') {
    ins_string = ''
  }
  return main_string.slice(0, pos) + ins_string + main_string.slice(pos)
}
