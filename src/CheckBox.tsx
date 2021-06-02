import * as React from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const CheckBox: React.FC<{
  style?: ViewStyle
  isChecked?: boolean
  toggle?: () => void
  editable?: boolean
}> = ({
  style = {},
  isChecked = false,
  toggle = () => {},
  editable = false,
}) => {
  const icon = isChecked ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
  return (
    <TouchableOpacity style={[style]} onPress={() => editable && toggle}>
      <Icon name={icon} size={20} />
    </TouchableOpacity>
  )
}

// const styles = StyleSheet.create({
//   default: {
//     // backgroundColor: 'red',
//   },
// })

export default CheckBox
