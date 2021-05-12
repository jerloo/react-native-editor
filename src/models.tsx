export interface ContentInlineStyle {
  offset: number
  length: number
  style: string
}

export interface ContentBlock {
  key?: string
  text?: string
  type?: string
  depth?: number
  inlineStyleRanges?: ContentInlineStyle[]
  entityRanges?: any[]
  data?: any
  styles?: string[]
  blocks?: ContentBlock[]
}

export interface ContentState {
  blocks: ContentBlock[]
  entityMap: any
}

export type AlignType = 'center' | 'auto' | 'left' | 'right' | 'justify'

export interface ContentRow {
  id?: string
  type?: string
  value?: string
  blocks?: ContentBlock[]
  align?: AlignType
  isCompleted?: boolean
  image?: string
  text?: string
}

export interface SelectionChangeEvent {
  row: ContentRow
  index: number
  value: string
}

export interface RenderItemInputData {
  row: ContentRow
  index: number
}

export interface Selection {
  start: number
  end: number
  id?: string
}

export interface InsertRowEvent {
  type?: string
  focus?: boolean
  focusIndex?: number | null
  newRowData?: ContentRow
  currentRow?: ContentRow | null
  insertAtActive?: boolean
  insertAfterActive?: boolean
  insertBeforeActive?: boolean
  insertAtLast?: boolean
  updateActiveIndex?: boolean
}
