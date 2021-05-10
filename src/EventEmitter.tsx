import { EventEmitter } from 'fbemitter'

let emitter: EventEmitter | null = null

export default () => {
  if (!emitter) {
    emitter = new EventEmitter()
  }
  return emitter
}
