import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const CheckBox = ({ style = {}, isChecked = false, toggle = () => {} }) => {
  const icon = isChecked ? 'check-box' : 'check-box-outline-blank'
  return (
    <TouchableOpacity style={[style]} onPress={toggle}>
      <Icon name={icon} size={20} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  default: {
    // backgroundColor: 'red',
  },
})

export default CheckBox
