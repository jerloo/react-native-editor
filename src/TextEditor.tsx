import { ActionSheet } from '@ant-design/react-native'
import _ from 'lodash'
import * as React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import Lightbox from 'react-native-lightbox'
import { check, PERMISSIONS } from 'react-native-permissions'

import CheckBox from './CheckBox'
import { COLORS, ROW_TYPES, STYLE_TYPES } from './Constants'
import { convertFromRaw, convertToRaw } from './Convertors'
import getEmitter from './EventEmitter'
import EVENTS from './Events'
import {
  attachStylesToSelectedText,
  generateId,
  getCurrentBlockInRow,
  getSelectedBlocks,
  insertAt,
  removeSelectedText,
  splitRow,
} from './Helpers'
// import Sketch from './Sketch'
import StyledTextInput from './StyledTextInput'
import styles from './Styles'
import TextToolbar from './TextToolbar'

const eventEmitter = getEmitter()

const listeners = {} as any

const isListRow = (type: string) =>
  type === ROW_TYPES.BULLETS ||
  type === ROW_TYPES.NUMBERS ||
  type === ROW_TYPES.TODOS

interface Props {
  data: { blocks: []; entityMap: {} }
  onFocus: (e: any) => void
  onChange: (e: any) => void
}

interface State {
  isReady: boolean
  isFullscreen: boolean
  isSketchVisible: boolean
  rows: any[]
  extraData: any
  activeRowIndex: number
  selection: { start: number; end: number; id: any }
  activeStyles: string[]
}

class Editor extends React.Component<Props, State> {
  textInputRefs: any[] = []
  sketch = null

  lastBlock = {}

  constructor(props: Props) {
    super(props)

    this.state = {
      isReady: false,
      isFullscreen: false,
      isSketchVisible: false,
      rows: [],
      extraData: null,
      activeRowIndex: 0,
      selection: { start: 0, end: 0, id: 'test' },
      activeStyles: [],
    }
  }

  componentDidMount() {
    listeners.hideKeyboard = eventEmitter.addListener(
      EVENTS.HIDE_KEYBOARD,
      this.hideKeyboard
    )
    listeners.toggleFullscreen = eventEmitter.addListener(
      EVENTS.TOGGLE_FULL_SCREEN,
      this.toggleFullscreen
    )
    listeners.showInsertRow = eventEmitter.addListener(
      EVENTS.SHOW_INSERT_BLOCK,
      this.showInsertRow
    )
    listeners.showUploadFile = eventEmitter.addListener(
      EVENTS.SHOW_UPLOAD_FILE,
      this.showUploadFile
    )
    listeners.toggleStyle = eventEmitter.addListener(
      EVENTS.TOGGLE_STYLE,
      this.toggleStyle
    )
    listeners.clearStyles = eventEmitter.addListener(
      EVENTS.CLEAR_STYLES,
      this.clearStyles
    )
    listeners.changeColorStyles = eventEmitter.addListener(
      EVENTS.CHANGE_COLOR_STYLE,
      this.changeColorStyles
    )
    listeners.alignRow = eventEmitter.addListener(
      EVENTS.ALIGN_ROW,
      this.alignRow
    )
    listeners.deleteActiveRow = eventEmitter.addListener(
      EVENTS.DELETE_BLOCK,
      this.deleteActiveRow
    )
    listeners.changeRowIndex = eventEmitter.addListener(
      EVENTS.CHANGE_BLOCK_INDEX,
      this.changeRowIndex
    )
    listeners.duplicateRow = eventEmitter.addListener(
      EVENTS.DUPLICATE_ROW,
      this.duplicateRow
    )
    listeners.showChangeRowType = eventEmitter.addListener(
      EVENTS.CHANGE_BLOCK_TYPE,
      this.showChangeRowType
    )
    listeners.changeRowIndent = eventEmitter.addListener(
      EVENTS.CHANGE_BLOCK_INDENT,
      this.changeRowIndent
    )
    listeners.reload = eventEmitter.addListener(EVENTS.RELOAD, this.reload)
    listeners.refresh = eventEmitter.addListener(EVENTS.REFRESH, this.refresh)
    // listeners.browseHistory = eventEmitter.addListener(EVENTS.BROWSE_HISTORY, this.browseHistory)

    listeners.logState = eventEmitter.addListener(EVENTS.LOG_STATE, () => {
      // console.tron.display({
      //   name: 'STATE',
      //   value: { props: this.state },
      // })
    })

    listeners.duplicateRow = eventEmitter.addListener(
      EVENTS.CONVERT_TO_RAW,
      () => {
        // const data = convertToRaw({ rows: this.state.rows })
        // console.tron.display({
        //   name: 'convertToRaw',
        //   value: { data },
        // })
      }
    )

    this.initialize()
  }

  // TODO: done
  componentWillUnmount() {
    if (listeners) {
      for (const key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          const listener = listeners[key]
          listener.remove()
        }
      }
    }
  }

  // TODO: done
  initialize = () => {
    this.fillContentState()
  }

  // TODO: done
  fillContentState = () => {
    const { data = { blocks: [], entityMap: {} } } = this.props
    const rows = convertFromRaw({ contentState: data })
    this.setState({ rows, isReady: true })
  }

  // TODO: reload
  reload = () => {
    this.fillContentState()
  }

  // TODO: done
  refresh = () => {
    const { activeRowIndex } = this.state
    this.setState({ isReady: false }, () => {
      setTimeout(() => {
        this.setState({ isReady: true }, () => {
          setTimeout(() => {
            this.focusRow({ index: activeRowIndex })
          }, 100)
        })
      }, 100)
    })
  }

  // TODO: done
  clear = () => {
    this.setState({ rows: [] })
  }

  // TODO: Done
  hideKeyboard() {
    Keyboard.dismiss()
  }

  // TODO: Done
  toggleFullscreen = () => {
    const { isFullscreen } = this.state
    this.setState({ isFullscreen: !isFullscreen })
  }

  // TODO: Done
  toggleStyle = ({ style }: { style: string }) => {
    const { activeStyles = [], selection, activeRowIndex, rows } = this.state

    const activeRow = Object.assign({}, rows[activeRowIndex])
    style = style.toLowerCase()
    const isStyleActive = activeStyles.includes(style)
    const oldStyles = [...activeStyles]

    let newActiveStyles = []

    if (isStyleActive) {
      newActiveStyles = activeStyles.filter((i) => i.toLowerCase() !== style)
    } else {
      newActiveStyles = [...activeStyles, style]
    }

    let newState = { activeStyles: newActiveStyles, rows } as any

    let throwOnChange = false

    if (
      activeRowIndex !== null &&
      selection.start < selection.end &&
      selection.id === activeRow.id
    ) {
      const data = attachStylesToSelectedText({
        selection,
        row: activeRow,
        newStyles: newActiveStyles,
        oldStyles,
      })
      activeRow.blocks = data!.blocks
      const newRows = [...rows]
      newRows[activeRowIndex] = activeRow

      newState = { ...newState, rows: newRows }
      throwOnChange = true
    } else {
      // const newRows = [...rows]
      // newRows[activeRowIndex] = activeRow
      // newState = {...newState, rows: newRows }
      // throwOnChange = true
    }

    this.setState({ ...newState, extraData: Date.now() }, () => {
      // this.textInputRefs[activeRowIndex].refresh({ focus: true })

      this.emitActiveStyles()
      if (throwOnChange) {
        this.emitOnChange()

        // this.textInputRefs[activeRowIndex].setSelection({ start: selection.start, end: selection.end })
      }
    })
  }

  // TODO: Done
  changeColorStyles = ({ color, type }: any) => {
    const { activeStyles = [], selection, activeRowIndex, rows } = this.state

    const activeRow = Object.assign({}, rows[activeRowIndex])
    const style = `${type}-${color}`
    const isStyleActive = activeStyles.includes(style)
    const oldStyles = [...activeStyles]

    let newActiveStyles = []

    if (isStyleActive) {
      newActiveStyles = activeStyles.filter((i) => i.toLowerCase() !== style)
    } else {
      newActiveStyles = activeStyles.filter(
        (i) => !i.toLowerCase().includes(type)
      )
      newActiveStyles = [...newActiveStyles, style]
    }

    let newState = { activeStyles: newActiveStyles, rows: [] } as any

    let throwOnChange = true

    if (
      activeRowIndex !== null &&
      selection.start < selection.end &&
      selection.id === activeRow.id
    ) {
      const data = attachStylesToSelectedText({
        selection,
        row: activeRow,
        newStyles: newActiveStyles,
        oldStyles,
      })
      activeRow.blocks = data!.blocks
      const newRows = rows.concat([])
      newRows[activeRowIndex] = activeRow

      newState = { ...newState, rows: newRows, extraData: Date.now() }
      throwOnChange = true
    }

    this.setState(newState, () => {
      this.emitActiveStyles()
      if (throwOnChange) {
        this.emitOnChange()
      }
    })
  }

  // TODO: review
  clearStyles = () => {
    const { selection, activeRowIndex, rows } = this.state

    const activeRow = Object.assign({}, rows[activeRowIndex])

    let newState = { activeStyles: [], rows: [] } as any
    const fills = COLORS.map((color) => `fill-${color}`)
    const colors = COLORS.map((color) => `color-${color}`)
    let oldStyles = [...Object.values(STYLE_TYPES), ...fills, ...colors]

    // console.tron.display({
    //   name: 'oldStyles',
    //   value: { props: oldStyles },
    // })

    let throwOnChange = false

    if (
      activeRowIndex !== null &&
      selection.start < selection.end &&
      selection.id === activeRow.id
    ) {
      const data = attachStylesToSelectedText({
        selection,
        row: activeRow,
        newStyles: [],
        oldStyles,
      })
      activeRow.blocks = data!.blocks
      const newRows = rows.concat([])
      newRows[activeRowIndex] = activeRow
      newState = { ...newState, rows: newRows, extraData: Date.now() }
      throwOnChange = true
    }

    this.setState(newState, () => {
      this.emitActiveStyles()
      if (throwOnChange) {
        this.emitOnChange()
      }
    })
  }

  // TODO: review
  alignRow = ({ type }: any) => {
    const { activeRowIndex, rows } = this.state

    // const activeRow = Object.assign({}, rows[activeRowIndex])

    const newRows = [...rows]
    newRows[activeRowIndex].align = type

    const newState = { rows: newRows, extraData: Date.now() }

    this.setState(newState, () => {
      this.emitActiveStyles()
      this.emitOnChange()
    })
  }

  // TODO: Done
  deleteActiveRow = () => {
    const { activeRowIndex, rows } = this.state
    if (activeRowIndex !== null && rows.length > 0) {
      this.removeRow({ index: activeRowIndex, focusPrev: true })
    }
  }

  // TODO: done
  showChangeRowType = () => {
    const { activeRowIndex, rows = [] } = this.state

    if (activeRowIndex === null) {
      return
    }

    const activeRow = Object.assign({}, rows[activeRowIndex])

    var BUTTONS = {
      [ROW_TYPES.TEXT]: 'Paragraph',
      [ROW_TYPES.HEADING1]: 'Heading 1',
      [ROW_TYPES.HEADING2]: 'Heading 2',
      [ROW_TYPES.HEADING3]: 'Heading 3',
      [ROW_TYPES.BLOCKQUOTE]: 'Blockquote',
      [ROW_TYPES.BULLETS]: 'Bulleted List',
      [ROW_TYPES.NUMBERS]: 'Numbered List',
      [ROW_TYPES.TODOS]: 'TODO List',
      cancel: 'Cancel',
    }
    var CANCEL_INDEX = Object.values(BUTTONS).length - 1
    var DESTRUCTIVE_INDEX = Object.keys(BUTTONS).indexOf(activeRow.type)

    ActionSheet.showActionSheetWithOptions(
      {
        options: Object.values(BUTTONS),
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Change Block Type',
      },
      (i) => {
        const keys = Object.keys(BUTTONS)
        if (keys[i] === 'text') {
          this.changeRowType({ index: activeRowIndex, type: ROW_TYPES.TEXT })
        }
        if (keys[i] === ROW_TYPES.HEADING1) {
          this.changeRowType({
            index: activeRowIndex,
            type: ROW_TYPES.HEADING1,
          })
        }
        if (keys[i] === ROW_TYPES.HEADING2) {
          this.changeRowType({
            index: activeRowIndex,
            type: ROW_TYPES.HEADING2,
          })
        }
        if (keys[i] === ROW_TYPES.HEADING3) {
          this.changeRowType({
            index: activeRowIndex,
            type: ROW_TYPES.HEADING3,
          })
        }
        if (keys[i] === 'blockquote') {
          this.changeRowType({
            index: activeRowIndex,
            type: ROW_TYPES.BLOCKQUOTE,
          })
        }
        if (keys[i] === 'bullets') {
          this.changeRowType({ index: activeRowIndex, type: ROW_TYPES.BULLETS })
        }
        if (keys[i] === ROW_TYPES.NUMBERS) {
          this.changeRowType({ index: activeRowIndex, type: ROW_TYPES.NUMBERS })
        }
        if (keys[i] === ROW_TYPES.TODOS) {
          this.changeRowType({ index: activeRowIndex, type: ROW_TYPES.TODOS })
        }
      }
    )
  }

  // TODO: done
  showInsertRow = () => {
    var BUTTONS = {
      [ROW_TYPES.TEXT]: 'Paragraph',
      [ROW_TYPES.HEADING1]: 'Heading 1',
      [ROW_TYPES.HEADING2]: 'Heading 2',
      [ROW_TYPES.HEADING3]: 'Heading 3',
      [ROW_TYPES.HR]: 'Line Break',
      [ROW_TYPES.BLOCKQUOTE]: 'Blockquote',
      [ROW_TYPES.BULLETS]: 'Bulleted List',
      [ROW_TYPES.NUMBERS]: 'Numbered List',
      [ROW_TYPES.TODOS]: 'TODO List',
      ['Sketch']: 'Sketch',
      cancel: 'Cancel',
    }
    var CANCEL_INDEX = Object.values(BUTTONS).length - 1
    var DESTRUCTIVE_INDEX = -1

    ActionSheet.showActionSheetWithOptions(
      {
        options: Object.values(BUTTONS),
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Insert Block',
      },
      (i) => {
        const keys = Object.keys(BUTTONS)
        if (keys[i] === ROW_TYPES.TEXT) {
          this.insertRow({ focus: true })
        }
        if (keys[i] === ROW_TYPES.HEADING1) {
          this.insertHeading({ heading: ROW_TYPES.HEADING1 })
        }
        if (keys[i] === ROW_TYPES.HEADING2) {
          this.insertHeading({ heading: ROW_TYPES.HEADING2 })
        }
        if (keys[i] === ROW_TYPES.HEADING3) {
          this.insertHeading({ heading: ROW_TYPES.HEADING3 })
        }
        if (keys[i] === ROW_TYPES.HR) {
          this.insertRow({
            type: ROW_TYPES.HR,
            focus: false,
            insertAfterActive: true,
          })
        }
        if (keys[i] === ROW_TYPES.BLOCKQUOTE) {
          this.insertRow({
            type: ROW_TYPES.BLOCKQUOTE,
            focus: true,
            insertAfterActive: true,
          })
        }
        if (keys[i] === ROW_TYPES.BULLETS) {
          this.insertList({ list: 'bullets' })
        }
        if (keys[i] === ROW_TYPES.NUMBERS) {
          this.insertList({ list: 'numbers' })
        }
        if (keys[i] === ROW_TYPES.TODOS) {
          this.insertList({ list: 'todos' })
        }
        if (keys[i] === 'Sketch') {
          this.showSketchModal()
        }
      }
    )
  }

  // FIXME: done
  showUploadFile = () => {
    var BUTTONS = {
      ['Take Photo']: 'Take Photo',
      ['Browse Photo']: 'Browse Photo',
      cancel: 'Cancel',
    }
    var CANCEL_INDEX = Object.values(BUTTONS).length - 1
    var DESTRUCTIVE_INDEX = -1

    ActionSheet.showActionSheetWithOptions(
      {
        options: Object.values(BUTTONS),
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Insert Image',
      },
      (i) => {
        const keys = Object.keys(BUTTONS)
        if (keys[i] === 'Take Photo') {
          this.insertImage({ type: 'Take Photo' })
        }
        if (keys[i] === 'Browse Photo') {
          this.insertImage({ type: 'Browse Photo' })
        }
      }
    )
  }

  // FIXME: Done
  insertImage = async ({ type }: { type: 'Take Photo' | 'Browse Photo' }) => {
    const rC = await check(PERMISSIONS.IOS.CAMERA)
    if (rC === 'granted') {
      console.log('CAMERA Permission Error')
      return
    }

    const r = await check(PERMISSIONS.IOS.MEDIA_LIBRARY)
    if (r === 'granted') {
      console.log('CAMERA_ROLL Permission Error')
      return
    }

    if (type === 'Take Photo') {
      launchCamera({ mediaType: 'photo' }, (result) => {
        console.log(result)

        if (!result.didCancel) {
          let newRowData = {
            id: generateId(),
            type: ROW_TYPES.IMAGE,
            image: result.uri,
          }
          this.insertRow({ newRowData, insertAfterActive: true, focus: true })
        }
      })
    } else {
      launchImageLibrary({ mediaType: 'photo' }, (result) => {
        console.log(result)

        if (!result.didCancel) {
          let newRowData = {
            id: generateId(),
            type: ROW_TYPES.IMAGE,
            image: result.uri,
          }
          this.insertRow({ newRowData, insertAfterActive: true, focus: true })
        }
      })
    }
  }

  // TODO: Done
  duplicateRow = () => {
    const { activeRowIndex, rows = [] } = this.state

    if (activeRowIndex === null) {
      return
    }

    const activeRow = Object.assign({}, rows[activeRowIndex])
    const newRowData = { ...activeRow, id: generateId() }

    this.insertRow({ newRowData, insertAfterActive: true, focus: true })
  }

  // TODO: Done
  emitActiveStyles = (
    { activeStyles, updateState = false }: any = { activeStyles: [] },
    callback = () => {}
  ) => {
    let newActiveStyles = activeStyles || this.state.activeStyles
    newActiveStyles = _.uniq(newActiveStyles)
    getEmitter().emit(EVENTS.ACTIVE_STYLE_CHANGED, {
      activeStyles: newActiveStyles,
    })
    if (updateState) {
      this.setState({ activeStyles })
    }
    callback()
  }

  // TODO: Done
  changeRowIndex = ({ direction }: any) => {
    const { activeRowIndex, rows = [] } = this.state

    if (activeRowIndex === null) {
      return
    }

    const newRows = [...rows]
    const currentBlock = Object.assign({}, rows[activeRowIndex])
    let shouldSwapIndex = false
    let newIndex: number = -1

    if (direction === 'up') {
      newIndex = activeRowIndex - 1
      const prevRow = Object.assign({}, rows[newIndex])
      if (prevRow && newIndex > -1) {
        newRows[newIndex] = currentBlock
        newRows[activeRowIndex] = prevRow
        shouldSwapIndex = true
      }
    }

    if (direction === 'down') {
      newIndex = activeRowIndex + 1
      const nextRow = Object.assign({}, rows[newIndex])
      if (nextRow) {
        newRows[newIndex] = currentBlock
        newRows[activeRowIndex] = nextRow
        shouldSwapIndex = true
      }
    }

    if (shouldSwapIndex) {
      this.focusRow({ index: newIndex })
      this.setState(
        { rows: newRows, activeRowIndex: newIndex, extraData: Date.now() },
        () => {
          this.emitOnChange()
          setTimeout(() => {
            this.focusRow({ index: newIndex })
          }, 50)
        }
      )
    }
  }

  // TODO: done
  changeRowIndent = ({ direction }: any) => {
    const { activeRowIndex, rows = [] } = this.state
    if (activeRowIndex === null) {
      return
    }

    const indent = '       '

    const newRows = [...rows]
    const currentRow = Object.assign({}, rows[activeRowIndex])
    const text = currentRow.value || ''

    if (direction === 'increase') {
      currentRow.value = `${indent}${text}`
      currentRow.blocks.unshift({ text: indent })
      newRows[activeRowIndex] = currentRow
      this.setState({ rows: newRows, extraData: Date.now() })
    }

    if (direction === 'decrease') {
      if (text.startsWith(indent)) {
        currentRow.value = text.slice(indent.length - 1, text.length)
        currentRow.blocks.shift()
        newRows[activeRowIndex] = currentRow
        this.setState({ rows: newRows, extraData: Date.now() })
      }
    }
  }

  // TODO: done
  splitRow = ({ row, index }: any) => {
    const { rows = [], selection } = this.state
    const newSplittedRows = splitRow({ row, selection })

    if (newSplittedRows) {
      let newActiveRowIndex = index + 1

      const newRows = [...rows]
      newRows[index] = newSplittedRows[0]
      let newSelection = { ...selection }
      if (newSplittedRows[1]) {
        newRows.splice(newActiveRowIndex, 0, newSplittedRows[1])
        newSelection = { ...selection, id: newSplittedRows[1].id }
      }
      this.setState(
        {
          rows: newRows,
          activeRowIndex: newActiveRowIndex,
          selection: newSelection,
          extraData: Date.now(),
        },
        () => {
          this.focusRow({ index: newActiveRowIndex })
        }
      )
    } else {
      console.log('Split rows without selection')
    }
  }

  // TODO: done
  showSketchModal = () => {
    this.setState({ isSketchVisible: true })
  }

  /**
   * TODO: re-write
   * beginning press enter: insert new block before (keep type if is list)
   * middle press enter: split row at cursor
   * end press enter: insert new block after (keep type if is list)
   */
  onSubmitEditing = ({ row, index }: any) => () => {
    const { rows = [], selection } = this.state

    const nextRow = Object.assign({}, rows[index + 1])
    const currentRow = Object.assign({}, rows[index])

    // If there is selected text, remove first
    // if (selection.start < selection.end) {
    //   const newRowBlocks = removeSelectedText({ selection, row }) || []
    //   currentRow.blocks = newRowBlocks
    //   row.blocks = newRowBlocks
    // }

    if (selection.start === 0 && selection.end === 0 && currentRow.value) {
      this.insertRow({
        focus: false,
        currentRow,
        insertBeforeActive: true,
        focusIndex: index + 1,
      })
    } else if (
      currentRow.value &&
      selection.start === selection.end &&
      selection.start > 0 &&
      selection.end < currentRow.value.length
    ) {
      // Split this line
      this.splitRow({ row, index })
    } else if (!currentRow.value && isListRow(currentRow.type)) {
      // Switch this line to text row
      this.changeRowType({ index, type: ROW_TYPES.TEXT })
    } else if (nextRow.id && isListRow(currentRow.type)) {
      this.insertRow({ focus: true, currentRow, insertAfterActive: true })
    } else if (nextRow.id) {
      this.insertRow({ focus: true, insertAfterActive: true })
    } else {
      this.insertRow({ focus: true, insertAfterActive: true, currentRow })
    }
  }

  // TODO: done
  onChangeText = ({ row, index }: any) => (nv = '') => {
    const { rows = [] } = this.state
    let newRows = [...rows]
    newRows[index].value = nv
    row.value = nv
    this.setState({ rows: newRows })
  }

  // FIXME: check
  handleBackspace = ({ row: item, index }: any) => {
    const { selection, rows = [] } = this.state
    let row = Object.assign({}, item)
    const prevRow = Object.assign({}, rows[index - 1])
    const { value = '' } = row

    if (selection.start < selection.end) {
      const newBlocks = removeSelectedText({ selection, row })
      const newRows = [...rows]
      newRows[index].blocks = newBlocks
      this.setState({ rows: newRows })
    } else if (
      selection.start === selection.end &&
      selection.start === 0 &&
      prevRow &&
      prevRow.type === ROW_TYPES.HR
    ) {
      this.removeRow({ index: index - 1 }, () => {
        this.focusRow({ index: index - 1 })
      })
    } else if (!value.length) {
      this.removeRow({ index, focusPrev: true })
    } else if (value.length === 1) {
      this.removeRow({ index, focusPrev: true })
    } else if (selection.start === 0) {
    } else {
      const newBlocks = removeSelectedText({ selection, row })
      let newRows = [...rows]
      newRows[index].blocks = newBlocks
      this.setState({ rows: newRows })

      // console.tron.display({
      //   name: 'Backspace',
      //   value: { blocks, newRows },
      // })
    }
  }

  getRowValue = ({ index }: any) => {
    return this.textInputRefs[index].getValue()
  }

  // FIXME: check
  handleKeyPress = ({ row: item, index }: any) => ({
    nativeEvent: { key: keyValue },
  }: any) => {
    const { rows = [], selection, activeStyles } = this.state
    let row = item // Object.assign({}, item)
    const currentRow = item // Object.assign({}, rows[index])
    let blocks = item.blocks // [...currentRow.blocks]

    row.value = this.getRowValue({ index })
    currentRow.value = this.getRowValue({ index })

    console.log('handleKeyPress fired::', keyValue)

    if (keyValue === 'Backspace') {
      this.handleBackspace({ row, index })
    } else if (keyValue === 'Enter') {
      this.setState({ selection: { start: 1, end: 1, id: null } })
    } else if (keyValue === 'Tab') {
      // TODO: indent
    } else {
      // If there is selected text, remove first
      if (selection.start < selection.end) {
        const newRowBlocks = removeSelectedText({ selection, row }) || []
        row.blocks = newRowBlocks
        blocks = [...newRowBlocks]
      }

      const currentBlock = getCurrentBlockInRow({ selection, row }) || {
        block: {
          text: '',
          styles: [],
        },
        pointerAt: 0,
        blockIndex: 0,
      }

      const {
        block: { text: blockText = '', styles: blockStyles = [] } = {} as any,
        pointerAt = 0,
        blockIndex = 0,
      } = currentBlock
      // console.tron.display({
      //   name: 'currentBlock',
      //   value: { props: currentBlock },
      // })

      let newBlocks = blocks // [].concat(blocks)

      const isStylesChanged = !_.isEqual(activeStyles, blockStyles)
      if (isStylesChanged) {
        let p1 = blocks.slice(0, blockIndex)
        let p2 = blocks.slice(blockIndex + 1)
        // console.tron.display({
        //   name: 'p1, p2',
        //   value: { p1, p2 },
        // })

        const newCharBlocks = []
        const blockBeforeText = blockText.substring(0, pointerAt)
        const blockAfterText = blockText.substring(pointerAt, blockText.length)

        const newBlock = { text: keyValue, styles: [...activeStyles] }
        if (blockBeforeText) {
          newCharBlocks.push({
            text: blockBeforeText,
            styles: [...blockStyles],
          })
        }

        newCharBlocks.push(newBlock)
        if (blockAfterText) {
          newCharBlocks.push({ text: blockAfterText, styles: [...blockStyles] })
        }

        newBlocks = [...p1, ...newCharBlocks, ...p2]
        // console.tron.display({
        //   name: 'newCharBlocks',
        //   value: { newCharBlocks, p1, p2,  },
        // })
      } else {
        const newBlockText = insertAt(blockText, keyValue, pointerAt)
        if (!newBlocks[blockIndex]) {
          newBlocks[blockIndex] = {}
        }
        newBlocks[blockIndex].text = newBlockText
      }
      // let newRows = [].concat(rows)
      let newRows = [...rows]
      newRows[index].blocks = newBlocks
      // newRows[index].value = newBlocks.map(i => item.text).join()
      rows[index].blocks = newBlocks
      let newState = { rows: rows, extraData: Date.now() }
      this.setState(newState, () => {
        if (isStylesChanged) {
          this.textInputRefs[index].stylesChanged({
            pointerAt: selection.start,
            row: newRows[index],
            keyValue,
          })
        }
      })
    }
    this.emitOnChange()
  }
  // FIXME: re-write
  onSelectionChange = ({ row, index, value }: any) => (event: any) => {
    const { selection } = event.nativeEvent
    const { rows = [], activeRowIndex, selection: oldSelection } = this.state
    const activeRow = Object.assign({}, rows[activeRowIndex])
    if (row.id !== activeRow.id) {
      return
    }
    row.value = value || this.getRowValue({ index })
    console.log(row.value)

    if (
      oldSelection.id === row.id &&
      oldSelection.start === selection.start &&
      oldSelection.end === selection.end
    ) {
      return
    }

    let newSelection = { ...selection, id: row.id }
    this.setState({ selection: newSelection }, () => {
      // console.log("onSelectionChange::", selection.start, selection.end, activeRowIndex)

      setTimeout(() => {
        if (
          newSelection.start === newSelection.end &&
          activeRowIndex !== null
        ) {
          const {
            block: { styles: blockStyles = [] } = {} as any,
            position,
          } = getCurrentBlockInRow({ selection: newSelection, row })
          let activeStyles = blockStyles

          if (position === 'end') {
            const lastBlockIndex = row.blocks.length - 1
            const lastBlock = row.blocks[lastBlockIndex] || { styles: [] }
            // console.tron.display({
            //   name: 'lastBlock',
            //   value: { props: lastBlock, row },
            // })
            activeStyles = blockStyles.concat(lastBlock.styles || [])
            activeStyles = _.uniq(activeStyles)
          }

          this.emitActiveStyles({ activeStyles, updateState: true })
        } else if (newSelection.start < newSelection.end) {
          const { startBlock, endBlock } = getSelectedBlocks({
            selection: newSelection,
            row,
          })
          const { blocks } = row

          const blockStyles = []

          for (let i = startBlock.blockIndex!; i <= endBlock.blockIndex!; i++) {
            const block = blocks[i] || {}
            const { styles = [], text = '' } = block
            if (text && text !== ' ') {
              blockStyles.push(styles)
            }
          }

          const commonStyles = _.intersection(...blockStyles)
          this.emitActiveStyles({
            activeStyles: commonStyles,
            updateState: true,
          })
        }
      })
    })
  }
  // FIXME: half
  onFocus = ({ index }: { index: number }) => (_e: any) => {
    const { activeRowIndex } = this.state
    // const activeRow = Object.assign({}, rows[index])
    if (activeRowIndex !== index) {
      this.setState({ activeRowIndex: index }, () => {
        // if(activeRow.value) {
        //   const newSelection = { start: activeRow.value.length, end: activeRow.value.length, id: activeRow.id }
        //   const event = { nativeEvent: { selection: newSelection } }
        //   this.onSelectionChange({ row: activeRow, index })(event)
        // } else {
        //   const newSelection = { start: 0, end: 0, id: activeRow.id }
        //   const event = { nativeEvent: { selection: newSelection } }
        //   this.onSelectionChange({ row: activeRow, index })(event)
        // }
        this.checkActiveRowTypeChanged()
      })
    } else {
      this.checkActiveRowTypeChanged()
    }
    const { onFocus } = this.props
    if (onFocus) {
      onFocus({ index, contentState: this.getContentState() })
    }
  }
  // TODO: half
  getContentState = () => {
    return convertToRaw({ rows: this.state.rows })
  }
  // TODO: done
  checkActiveRowTypeChanged = () => {
    const { activeRowIndex, rows = [] } = this.state
    const activeRow = rows[activeRowIndex] || {}
    const { type = '' } = activeRow
    getEmitter().emit(EVENTS.ROW_TYPE_CHANGED, { type })
  }
  // TODO: needs check
  focusRow(
    { index, timeout = 0, clearStyles = true }: any,
    callback = () => {}
  ) {
    const { rows = [], activeStyles = [], activeRowIndex } = this.state
    const input = this.textInputRefs[index]
    if (input) {
      const row = Object.assign({}, rows[index])
      let newStyles = [...activeStyles]
      if (!row.value || clearStyles) {
        newStyles = []
        console.log(newStyles)
      }
      let newState = {} as any // { activeStyles: newStyles }
      if (activeRowIndex !== index) {
        newState.activeRowIndex = index
      }

      this.setState(newState, () => {
        setTimeout(() => {
          input.focus()
          callback()
        }, timeout)
      })
    }
  }
  // FIXME: needs attention
  insertRow(
    {
      type = ROW_TYPES.TEXT,
      focus = false,
      focusIndex = null,
      newRowData,
      currentRow,
      insertAtActive = false,
      insertAfterActive = false,
      insertBeforeActive = false,
      insertAtLast = false,
      updateActiveIndex = false,
    }: any = {},
    callback = (_e: any) => {}
  ) {
    const { rows = [], activeRowIndex } = this.state
    let newRows = [...rows]
    let newRow = newRowData || { id: generateId(), type, blocks: [] }
    if (currentRow) {
      if (currentRow.type === ROW_TYPES.BULLETS) {
        newRow.type = ROW_TYPES.BULLETS
      }
      if (currentRow.type === ROW_TYPES.NUMBERS) {
        newRow.type = ROW_TYPES.NUMBERS
      }
      if (currentRow.type === ROW_TYPES.TODOS) {
        newRow.type = ROW_TYPES.TODOS
      }
    }
    if (activeRowIndex !== null) {
      const activeRow = Object.assign({}, rows[activeRowIndex])
      newRow.align = activeRow.align
    }
    newRow = Object.assign({}, newRow)
    let newRowIndex: number
    if (activeRowIndex !== null && insertAtActive) {
      newRows.splice(activeRowIndex, 0, newRow)
      newRowIndex = activeRowIndex
    } else if (activeRowIndex !== null && insertAfterActive) {
      newRows.splice(activeRowIndex + 1, 0, newRow)
      newRowIndex = activeRowIndex + 1
    } else if (activeRowIndex !== null && insertBeforeActive) {
      newRows.splice(activeRowIndex, 0, newRow)
      newRowIndex = activeRowIndex
    } else if (insertAtLast) {
      newRows.push(newRow)
      newRowIndex = rows.length - 1
    } else {
      newRows.push(newRow)
      newRowIndex = rows.length - 1
    }
    const newState = {
      rows: newRows,
      extraData: Date.now(),
      activeStyles: [],
      selection: { start: 0, end: 0, id: newRow.id },
      activeRowIndex: -1,
    }
    if (updateActiveIndex && !focus) {
      newState.activeRowIndex = newRowIndex
    }
    if (focusIndex !== null) {
      newState.activeRowIndex = focusIndex
    }
    this.setState(newState, () => {
      this.emitActiveStyles()
      this.emitOnChange()
      callback({ newRowIndex, newRow })
      // setTimeout(() => {
      if (focus) {
        this.focusRow({ index: newRowIndex, isNew: true })
      }
      if (focusIndex !== null) {
        this.focusRow({ index: focusIndex })
      }
      // });
    })
  }
  // TODO: done
  insertHeading = ({ heading }: any) => {
    this.insertRow({ type: heading, focus: true, insertAfterActive: true })
  }

  // TODO: done
  insertList = ({ list }: any) => {
    const key = list.toUpperCase()
    this.insertRow({
      type: (ROW_TYPES as any)[key],
      focus: true,
      insertAfterActive: true,
    })
  }
  // TODO: done
  removeRow({ index, focusPrev = false }: any, callback = () => {}) {
    const { rows = [] } = this.state
    if (rows.length > 0) {
      let newRows = [...rows]
      newRows.splice(index, 1)
      this.setState(
        { rows: newRows, activeRowIndex: index - 1, extraData: Date.now() },
        () => {
          this.emitOnChange()
          setTimeout(() => {
            if (focusPrev) {
              this.focusRow({ index: index - 1 })
            }
            callback()
          })
        }
      )
    }
  }
  // TODO: done
  emitOnChange = () => {
    const { onChange } = this.props
    if (onChange) {
      onChange(this.getContentState())
    }
  }
  // TODO: done
  changeRowType({ index, type }: any) {
    const { rows = [] } = this.state
    const row = Object.assign({}, rows[index])
    if (row) {
      row.type = type
      // If its heading row, remove styles
      if (type.includes('heading')) {
        row.blocks = row.blocks.map((item: any) => ({ text: item.text }))
      }
      const newRows = [...rows]
      newRows[index] = row
      this.setState({ rows: newRows, extraData: Date.now() }, () => {
        this.emitOnChange()
        this.checkActiveRowTypeChanged()
        this.focusRow({ index, timeout: 100 })
      })
    }
  }
  // FIXME:
  handleImage = ({ _row, index }: any) => () => {
    // const { activeRowIndex, rows = [] } = this.state
    ActionSheet.showActionSheetWithOptions(
      {
        options: ['Delete', 'Cancel'],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        title: 'Delete Image',
      },
      (i) => {
        if (i === 0) {
          // this.changeRowType({ index: activeRowIndex, type: ROW_TYPES.TEXT })
          this.removeRow({ index, focusPrev: true })
        }
      }
    )
  }
  // FIXME:
  toggleTodo = ({ row, index }: any) => () => {
    const { rows = [] } = this.state
    const isCompleted = !row.isCompleted
    const newRows = [...rows]
    newRows[index].isCompleted = isCompleted
    this.setState({ rows: newRows })
  }
  // FIXME:
  onSketchSave = (image: any) => {
    if (!image) {
      this.setState({ isSketchVisible: false })
      return
    }
    let newRowData = { id: generateId(), type: ROW_TYPES.IMAGE, image }
    this.insertRow({ newRowData, insertAfterActive: true, focus: true }, () => {
      this.setState({ isSketchVisible: false })
    })
  }
  // FIXME: re-think
  getPlaceholder = ({ row, index }: any) => {
    const { rows } = this.state
    if (index === 0 && rows.length === 1) {
      return 'Write...'
    }
    if (row.type === ROW_TYPES.HEADING1) {
      return 'Heading 1'
    }
    if (row.type === ROW_TYPES.HEADING2) {
      return 'Heading 2'
    }
    if (row.type === ROW_TYPES.HEADING3) {
      return 'Heading 3'
    }
    if (row.type === ROW_TYPES.BLOCKQUOTE) {
      return 'Blockquote'
    }
    if (row.type === ROW_TYPES.BULLETS) {
      return 'List'
    }
    if (row.type === ROW_TYPES.NUMBERS) {
      return 'List'
    }
    return ''
  }

  // TODO: half
  getInputStyles = ({ row }: any) => {
    if (row.type === ROW_TYPES.HEADING1) {
      return styles.heading1
    }
    if (row.type === ROW_TYPES.HEADING2) {
      return styles.heading2
    }
    if (row.type === ROW_TYPES.HEADING3) {
      return styles.heading3
    }
    if (row.type === ROW_TYPES.BLOCKQUOTE) {
      return styles.blockquote
    }
    return {}
  }

  // TODO: half
  getNumberOrder = ({ _row, index }: any) => {
    const { rows } = this.state
    let numberOrder = 0
    for (let i = index; i >= 0; i--) {
      const block = rows[i]
      if (block.type !== ROW_TYPES.NUMBERS) {
        break
      }
      numberOrder += 1
    }
    return numberOrder
  }

  // TODO: half
  getAlignStyles = ({ row }: any) => {
    let styles = {} as any

    if (row.align) {
      styles.textAlign = row.align
    }

    return styles
  }

  renderInput = ({ row, index }: any) => {
    const placeholder = this.getPlaceholder({ row, index })
    const inputStyles = this.getInputStyles({ row, index })
    const alignStyles = this.getAlignStyles({ row, index })

    const isBullet = row.type === ROW_TYPES.BULLETS
    const isNumbers = row.type === ROW_TYPES.NUMBERS
    const isTodo = row.type === ROW_TYPES.TODOS
    const numberOrder = this.getNumberOrder({ row, index })

    // const { blocks = [] } = row

    return (
      <View style={styles.row}>
        {isBullet && <Text style={styles.bullet}>•</Text>}
        {isNumbers && <Text style={styles.numberOrder}>{numberOrder}.</Text>}
        {isTodo && (
          <CheckBox
            style={styles.checkbox}
            isChecked={row.isCompleted}
            toggle={this.toggleTodo({ row, index })}
          />
        )}
        <StyledTextInput
          underlineColorAndroid='transparent'
          ref={(input) => {
            this.textInputRefs[index] = input
          }}
          placeholder={placeholder}
          onSubmitEditing={this.onSubmitEditing}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          handleKeyPress={this.handleKeyPress}
          onSelectionChange={this.onSelectionChange}
          textInput={styles.textInput}
          inputStyles={inputStyles}
          alignStyles={alignStyles}
          row={row}
          index={index}
          value={row.value}
        />
      </View>
    )
  }

  // FIXME: needs attention
  renderItem = ({ item: row, index }: any) => {
    if (row.type === ROW_TYPES.HR) {
      return this.renderLineBreak({ row, index })
    }

    if (row.type === ROW_TYPES.IMAGE) {
      return this.renderImage({ row, index })
    }

    return this.renderInput({ row, index })
  }

  // FIXME:
  renderImage = ({ row, index }: any) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.imageRow}
          onLongPress={this.handleImage({ row, index })}
        >
          <Lightbox>
            <Image
              source={{ uri: row.image }}
              resizeMode='contain'
              style={styles.image}
            />
          </Lightbox>
        </TouchableOpacity>
      </View>
    )
  }

  // FIXME:
  renderLineBreak = ({ _row, _index }: any) => {
    return (
      <View style={styles.row}>
        <View style={styles.hr} />
      </View>
    )
  }

  // FIXME: half - bug when last row is list
  renderFooter = () => {
    const { rows = [] } = this.state
    const lastRowIndex = rows.length - 1
    let lastRow = rows[lastRowIndex]
      ? Object.assign({}, rows[lastRowIndex])
      : null
    return (
      <View style={styles.row}>
        <TextInput
          underlineColorAndroid='transparent'
          blurOnSubmit={false}
          style={[styles.textInput]}
          clearButtonMode='never'
          autoCorrect={false}
          onFocus={() => {
            this.insertRow({
              focusIndex: lastRowIndex + 1,
              currentRow: lastRow,
            })
          }}
          autoCapitalize='none'
          returnKeyType='default'
          multiline={false}
          placeholder='Footer'
        />
      </View>
    )
  }

  // FIXME: half - focus
  renderEmpty = () => {
    return (
      <View style={styles.row}>
        <TextInput
          underlineColorAndroid='transparent'
          blurOnSubmit={false}
          style={[styles.textInput]}
          clearButtonMode='never'
          autoCorrect={false}
          onFocus={() => {
            this.insertRow({ focusIndex: 0 })
          }}
          autoCapitalize='none'
          returnKeyType='default'
          multiline={false}
          placeholder='Empty'
        />
      </View>
    )
  }

  // TODO: done
  renderLoading = () => {
    return (
      <View>
        <ActivityIndicator size='small' />
      </View>
    )
  }

  // FIXME: empty
  renderHeader = () => {
    return <View />
  }

  // FIXME: half
  renderList() {
    const { rows, extraData, isReady } = this.state

    if (!isReady) {
      return this.renderLoading()
    }

    return (
      <FlatList
        data={rows}
        keyExtractor={(i) => i.id}
        extraData={extraData}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode='on-drag'
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
        ListEmptyComponent={this.renderEmpty}
        ListHeaderComponent={this.renderHeader}
        style={styles.flatList}
      />
    )
  }

  renderFullScreen() {
    const { isFullscreen } = this.state
    return (
      <Modal
        visible={isFullscreen}
        transparent={false}
        animationType='slide'
        onRequestClose={() => {}}
      >
        <View>
          <View>
            <View>
              <Text>Edit Text</Text>
            </View>
          </View>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <KeyboardAwareView keyboardShouldPersistTaps animated>
                <View style={styles.editor}>{this.renderList()}</View>
                <TextToolbar />
              </KeyboardAwareView>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    )
  }

  // renderSketchModal() {
  //   const { isSketchVisible } = this.state
  //   return (
  //     <Sketch
  //       isSketchVisible={isSketchVisible}
  //       onCancel={() => {
  //         this.setState({ isSketchVisible: false })
  //       }}
  //       onSave={this.onSketchSave}
  //     />
  //   )
  // }

  render() {
    const { isFullscreen, isReady } = this.state

    if (!isReady) {
      return this.renderLoading()
    }

    return (
      <React.Fragment>
        {isFullscreen ? this.renderFullScreen() : this.renderList()}
        {/* {this.renderSketchModal()} */}
      </React.Fragment>
    )
  }
}

export default Editor
