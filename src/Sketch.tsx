// // import * as ExpoPixi from 'expo-pixi'
// import {
//   Body,
//   Button,
//   Container,
//   Footer,
//   Header,
//   Icon,
//   Left,
//   Right,
//   Text,
//   Title,
// } from 'native-base'
// import * as React from 'react'
// import { Modal, Slider, TouchableOpacity, View } from 'react-native'

// import styles from './Styles'

// const COLORS = [
//   '#2fbbf8',
//   '#3efb43',
//   '#fc39f5',
//   '#e72535',
//   '#fb7d34',
//   '#fcfcfc',
// ]

// const ColorDot = ({
//   color: backgroundColor,
//   selected: selectedColor,
//   setColor,
// }: {
//   color: string
//   selected: string
//   setColor: (color: string) => void
// }) => {
//   return (
//     <TouchableOpacity
//       onPress={() => setColor(backgroundColor)}
//       style={[styles.colorDot, { backgroundColor }]}
//     >
//       {selectedColor === backgroundColor && (
//         <View style={styles.colorDotSelected} />
//       )}
//     </TouchableOpacity>
//   )
// }

// interface Props {
//   isSketchVisible: boolean
//   onCancel: () => void
//   onSave: (img: any) => void
// }

// interface State {
//   image: null
//   initializing: boolean
//   strokeColor: string
//   strokeWidth: number
//   strokeAlpha: number
//   lines: [
//     {
//       points: [
//         { x: number; y: number },
//         { x: number; y: number },
//         { x: number; y: number },
//         { x: number; y: number }
//       ]
//       color: 0xff00ff
//       alpha: number
//       width: number
//     }
//   ]
// }

// class SketchModal extends React.Component<Props, State> {
//   sketch: any = null

//   lastBlock = {}

//   constructor(props: Props) {
//     super(props)
//     this.state = {
//       image: null,
//       initializing: true,
//       strokeColor: COLORS[0],
//       strokeWidth: Math.random() * 30 + 10,
//       strokeAlpha: 1,
//       lines: [
//         {
//           points: [
//             { x: 300, y: 300 },
//             { x: 600, y: 300 },
//             { x: 450, y: 600 },
//             { x: 300, y: 300 },
//           ],
//           color: 0xff00ff,
//           alpha: 1,
//           width: 10,
//         },
//       ],
//     }
//   }

//   setColor = (strokeColor: string) => this.setState({ strokeColor })
//   setWidth = (strokeWidth: number) => this.setState({ strokeWidth })

//   onReady = () => {
//     console.log('onReady')
//   }

//   onChangeAsync = async () => {
//     const { uri } = await this.sketch.takeSnapshotAsync()
//     this.setState({ image: uri })
//   }

//   undo = () => {
//     this.sketch.undo()
//   }

//   onSave = () => {
//     const { image } = this.state
//     console.log(image)
//     const { onSave = (_img: any) => {} } = this.props
//     onSave(image)
//   }

//   render() {
//     const { isSketchVisible, onCancel } = this.props
//     const { strokeColor = '', strokeWidth, lines, strokeAlpha } = this.state

//     return (
//       <Modal
//         visible={isSketchVisible}
//         transparent={false}
//         animationType='slide'
//         onRequestClose={onCancel}
//       >
//         <Container>
//           <Header>
//             <Left>
//               <Button transparent small onPress={this.undo}>
//                 <Icon name='refresh' />
//               </Button>
//             </Left>
//             <Body>
//               <Title>Sketch</Title>
//             </Body>
//             <Right />
//           </Header>

//           <View style={styles.colorsContainer}>
//             {COLORS.map((item) => (
//               <ColorDot
//                 key={item}
//                 color={item}
//                 selected={strokeColor}
//                 setColor={this.setColor}
//               />
//             ))}
//           </View>

//           <View style={styles.colorsContainer}>
//             <Slider
//               minimumValue={0}
//               maximumValue={1}
//               onValueChange={(e) => this.setState({ strokeAlpha: e })}
//               step={0.1}
//               value={strokeAlpha}
//               style={{ flex: 1 }}
//             />
//           </View>

//           <View style={styles.colorsContainer}>
//             <Slider
//               minimumValue={1}
//               maximumValue={100}
//               onValueChange={(e) => this.setState({ strokeWidth: e })}
//               step={1}
//               value={strokeWidth}
//               style={{ flex: 1 }}
//             />
//           </View>

//           <View style={styles.sketchContainer}>
//             {/* <ExpoPixi.Sketch
//               ref={(ref) => (this.sketch = ref)}
//               style={styles.sketch}
//               strokeColor={`0x${strokeColor.replace('#', '')}`}
//               strokeWidth={strokeWidth}
//               strokeAlpha={strokeAlpha}
//               onChange={this.onChangeAsync}
//               onReady={this.onReady}
//               initialLines={lines}
//             /> */}
//           </View>

//           <Footer>
//             <View style={styles.sketchFooter}>
//               <Button transparent iconLeft onPress={onCancel}>
//                 <Icon name='close' />
//                 <Text>Cancel</Text>
//               </Button>
//               <Button transparent iconRight onPress={this.onSave}>
//                 <Text>Save</Text>
//                 <Icon name='save' />
//               </Button>
//             </View>
//           </Footer>
//         </Container>
//       </Modal>
//     )
//   }
// }

// export default SketchModal
