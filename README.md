# react-native-editor

[![npm version](https://img.shields.io/npm/v/@apprush/react-native-editor.svg?style=flat)](https://www.npmjs.com/package/@apprush/react-native-editor) 
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jerloo/react-native-editor/blob/master/LICENSE) 
 ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
 <!-- [![CircleCI Status](https://circleci.com/gh/facebook/react.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/facebook/react) -->
<!-- [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Travis](https://img.shields.io/travis/jeremaihloo/@apprush/react-native-editor.svg)](https://travis-ci.org/jeremaihloo/react-native-editor)
![David](https://img.shields.io/david/@apprush/react-native-editor) -->
<!-- [![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/jeremaihloo) -->

A responsive solution for iphone6 ui design.

### Installation

```bash
yarn add @apprush/react-native-editor
```

### Usage


```tsx
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
```