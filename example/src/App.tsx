import {
  EVENTS,
  getEmitter,
  TextEditor,
  TextToolbar,
  ContentState,
  createContentStateFromText,
} from '@apprush/react-native-editor'
import { Body, Button, Container, Icon, Title } from 'native-base'
import React, { useState } from 'react'
import { useRef } from 'react'
import { LogBox, SafeAreaView, StyleSheet, View } from 'react-native'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
LogBox.ignoreLogs(['Animated: `useNativeDriver`'])

const eventEmitter = getEmitter()

const App = () => {
  const editor = useRef<TextEditor | null>(null)
  const [extraData, setExtraData] = useState(Date.now())
  const [contentState, setContentState] = useState(() =>
    createContentStateFromText('Hello world! \nI am jerloo')
  )
  const logState = () => {
    eventEmitter.emit(EVENTS.LOG_STATE)
  }

  const reload = () => {
    if (editor) {
      editor.current?.reload()
    } else {
      console.log('reload')
    }
  }

  const refresh = () => {
    if (editor) {
      editor.current?.refresh()
    } else {
      console.log('refresh')
    }
  }

  const clear = () => {
    if (editor) {
      editor.current?.clear()
    } else {
      console.log('clear')
    }
  }

  const convert = () => {
    eventEmitter.emit(EVENTS.CONVERT_TO_RAW)
  }

  const onChange = (data: ContentState) => {
    console.log(data)
    setExtraData(Date.now())
  }
  return (
    <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Button transparent onPress={convert}>
          <Icon name='save' />
        </Button>
        <Body>
          <Title>Text Editor</Title>
        </Body>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Button transparent onPress={reload}>
            <Icon name='md-refresh' />
          </Button>
          <Button transparent onPress={refresh}>
            <Icon name='refresh' />
          </Button>
          <Button transparent onPress={clear}>
            <Icon name='trash' />
          </Button>
          <Button transparent onPress={logState}>
            <Icon name='list' />
          </Button>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <KeyboardAwareView keyboardShouldPersistTaps animated>
            <View style={styles.editor}>
              <TextEditor
                ref={editor}
                data={contentState}
                onChange={onChange}
                extraData={extraData}
                editable={false}
              />
            </View>
            <TextToolbar />
          </KeyboardAwareView>
        </Container>
      </SafeAreaView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    // alignItems: 'stretch',
    // justifyContent: 'center',
    // flexDirection: 'column',
  },
  editor: {
    // minHeight: 100,
    // width: 300,
    padding: 20,
    flex: 1,
    // backgroundColor: 'red'
  },
})

export default App
