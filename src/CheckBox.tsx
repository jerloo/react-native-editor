import { Icon } from 'native-base'
import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

const CheckBox = ({ style = {}, isChecked = false, toggle = () => {} }) => {
  const icon = isChecked ? 'check-box' : 'check-box-outline-blank'
  return (
    <TouchableOpacity style={[style]} onPress={toggle}>
      <Icon name={icon} fontSize={20} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  default: {
    // backgroundColor: 'red',
  },
})

export default CheckBox
