import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const CheckBox = ({ style = {}, isChecked = false, toggle = () => {} }) => {
  const icon = isChecked ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
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
