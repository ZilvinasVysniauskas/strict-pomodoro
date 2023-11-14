import { sendMessage } from '../common/chromeMessage'
import { MessageTypes } from '../types'
import './forbiddenWebsitePopup.scss'

const elementIdSubtext = 'unique-identifier-440567360256974571514025536219'

if (!document.getElementById(`${elementIdSubtext}-myPopup`)) {
  const popup = createPopupElement(window.location.href)
  document.body.appendChild(popup)
  setUpUserActionListeners(popup)
}

function setUpUserActionListeners (popup: HTMLDivElement) {
  const closeForbiddenTab = document.getElementById(`${elementIdSubtext}-close-forbidden`)
  const closePopup = document.getElementById(`${elementIdSubtext}-close-popup`)
  closeForbiddenTab.addEventListener('click', () => {
    sendMessage({ type: MessageTypes.CloseActiveTab })
  })
  closePopup.addEventListener('click', () => {
    popup.remove()
  })
}

function createPopupElement (websiteUrl: string): HTMLDivElement {
  const popup = document.createElement('div')
  popup.id = `${elementIdSubtext}-myPopup`
  popup.innerHTML = `
            <h1>FORBIDDEN WEBSITE</h1>
            <br>
            <p>${websiteUrl} is forbidden.</p>
            <p><strong>Pomodoro timer is counting up</strong></p>
            <p><strong>Close this tab to continue your study session</strong></p>
            <br>
            <div>
                <button id="${elementIdSubtext}-close-forbidden" class="action-button">Close page and continue timer</button>
                <button id="${elementIdSubtext}-close-popup" class="negative-button">Close popup</button>
            </div>
        `
  return popup
}
