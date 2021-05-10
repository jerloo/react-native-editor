import React from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { Container, Body, Title, Button, Icon } from 'native-base'

import {
  TextEditor,
  TextToolbar,
  getEmitter,
  EVENTS,
  contentState,
} from '@apprush/react-native-editor'

const eventEmitter = getEmitter()

let editor: any = null

export default class App extends React.Component {
  state = {
    extraData: Date.now(),
  }

  logState() {
    eventEmitter.emit(EVENTS.LOG_STATE)
  }

  reload() {
    if (editor) {
      editor.reload()
    } else {
      console.log('reload')
    }
  }

  refresh() {
    if (editor) {
      editor.refresh()
    } else {
      console.log('refresh')
    }
  }

  clear() {
    if (editor) {
      editor.clear()
    } else {
      console.log('clear')
    }
  }

  convert() {
    eventEmitter.emit(EVENTS.CONVERT_TO_RAW)
  }

  onChange = (data: any) => {
    console.log(data)
    this.setState({ extraData: Date.now() })
  }

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Button transparent onPress={this.convert}>
            <Icon name='save' />
          </Button>
          <Body>
            <Title>Text Editor</Title>
          </Body>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Button transparent onPress={this.reload}>
              <Icon name='md-refresh' />
            </Button>
            <Button transparent onPress={this.refresh}>
              <Icon name='refresh' />
            </Button>
            <Button transparent onPress={this.clear}>
              <Icon name='trash' />
            </Button>
            <Button transparent onPress={this.logState}>
              <Icon name='list' />
            </Button>
          </View>
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          <Container>
            <KeyboardAwareView keyboardShouldPersistTaps animated>
              <View style={styles.editor}>
                <TextEditor
                  ref={(e) => {
                    editor = e
                  }}
                  data={contentState}
                  onChange={this.onChange}
                  extraData={this.state.extraData}
                />
              </View>
              <TextToolbar />
            </KeyboardAwareView>
          </Container>
        </SafeAreaView>
      </SafeAreaView>
    )
  }
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
