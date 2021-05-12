import * as React from 'react'
import { TextInput, View, ViewStyle } from 'react-native'

import { ContentRow, Selection } from './models'
import StyledText from './StyledText'

interface Props {
  value: string
  row: ContentRow
  index: number
  handleKeyPress: (args: any) => (e: any) => void
  onChangeText: (args: any) => (e: any) => void
  placeholder: string
  onSubmitEditing: (e: any) => (e: any) => void
  onFocus: (e: any) => (e: any) => void
  onSelectionChange: (e: any) => (e: any) => void
  textInput: ViewStyle
  inputStyles: ViewStyle
  alignStyles: ViewStyle
  underlineColorAndroid: string
}

interface State {
  value: string
  now: any
  hide: boolean
}

class StyledInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      now: null,
      hide: false,
      value: '',
    }
  }

  input: any = null

  componentDidMound() {
    const { value = '' } = this.props
    this.setState({ value })
  }

  componentDidUpdate(prevProps: Props) {
    // console.log(prevProps.row)
    if (prevProps.row.text !== this.props.row.text) {
      console.log(prevProps.row.text, this.props.row.text)
      this.forceUpdate()
    }
  }

  handleKeyPress = (e: any) => {
    const { row, index } = this.props
    this.props.handleKeyPress({ row, index })(e)
  }

  onChangeText = (nv = '') => {
    const { row, index, onChangeText } = this.props
    const newValue = nv.replace(/\n/, '')
    this.setState({ value: newValue })
    onChangeText({ row, index })(nv)
  }

  getValue = () => {
    return this.state.value
  }

  focus = () => {
    if (this.input) {
      this.input!.focus()
    }
  }

  setSelection = ({ start, end }: Selection) => {
    // const { row, index, onSelectionChange } = this.props

    this.input.setNativeProps({ selection: { start, end } })
    setTimeout(() => {
      this.input.setNativeProps({ selection: { start, end } })
      console.log({ start, end })
      // setTimeout(() => {
      // onSelectionChange({ row, index })({ nativeEvent: { selection: { start, end } } })
      // setTimeout(() => {
      //   onSelectionChange({ row, index })({ nativeEvent: { selection: { start, end } } })
      // });
      // });
    })
  }

  refresh = ({ focus = false } = {}, callback = () => {}) => {
    this.setState({ hide: true }, () => {
      setTimeout(() => {
        this.setState({ hide: false }, () => {
          if (focus) {
            this.input.focus()
          }
          callback()
        })
      }, 0)
    })
  }

  onEndEditing = () => {
    this.refresh()
  }

  stylesChanged = ({ pointerAt }: any) => {
    const {
      row: { value = '' },
    } = this.props
    this.refresh({ focus: true }, () => {
      if (value.length > pointerAt) {
        this.setSelection({ start: pointerAt + 1, end: pointerAt + 1 })
      } else {
        // const newValue = row.blocks.map(i => i.text).join('')
        // this.props.onSelectionChange({ row: this.props.row, index, value: newValue })({ nativeEvent: { selection: { start: pointerAt + 1, end: pointerAt + 1 } } })
      }
    })
  }

  render() {
    const {
      row,
      index,
      placeholder,

      onSubmitEditing,
      onFocus,
      onSelectionChange,

      textInput,
      inputStyles,
      alignStyles,
    } = this.props

    const { blocks = [] } = row

    if (this.state.hide) {
      return (
        <View style={[{ flexDirection: 'row', minHeight: 17 }, alignStyles]}>
          {blocks.map((block, i) => (
            <StyledText
              key={`${row.id}-${i}`}
              textStyles={block.styles}
              text={block.text}
              type={row.type}
              isCompleted={row.isCompleted}
            />
          ))}
        </View>
      )
    }

    return (
      <TextInput
        ref={(c) => {
          this.input = c
        }}
        underlineColorAndroid='transparent'
        placeholder={placeholder}
        onSubmitEditing={onSubmitEditing({ row, index })}
        onFocus={onFocus({ row, index })}
        onChangeText={this.onChangeText}
        onKeyPress={this.handleKeyPress}
        onSelectionChange={onSelectionChange({ row, index })}
        onEndEditing={this.onEndEditing}
        style={[textInput, inputStyles, alignStyles]}
        clearButtonMode='never'
        blurOnSubmit={false}
        autoCorrect={false}
        autoCapitalize='none'
        returnKeyType='default'
        multiline={!false}
        scrollEnabled={false}
      >
        {blocks.map((block, i) => (
          <StyledText
            key={`${row.id}-${i}`}
            textStyles={block.styles}
            text={block.text}
            type={row.type}
            isCompleted={row.isCompleted}
          />
        ))}
      </TextInput>
    )
  }
}

export default StyledInput
