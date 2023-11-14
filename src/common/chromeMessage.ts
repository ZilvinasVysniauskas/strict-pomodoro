import { type ChromeMessage } from '../types'

export function sendMessage(message: ChromeMessage): void {
  chrome.runtime.sendMessage({ type: message.type, body: message.body },
    () => {
      if (chrome.runtime.lastError) {
        console.log(`Receiving end form message type [${message.type}] does not exists.\nMessage was not sent`)
      }
    }
  )
}
