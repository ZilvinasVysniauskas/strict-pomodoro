/* eslint-disable @typescript-eslint/*/
import { type ChromeMessage, MessageTypes } from '../../types'
import { startTimerPenalty, stopTimerPenalty } from './timer'
import {ChromeStorageKeys} from "../../constants"


chrome.runtime.onMessage.addListener(closeTabLister)

export function addTabsListers (): void {
  chrome.tabs.onActivated.addListener(() => closeTabLister)
  chrome.tabs.onActivated.addListener(onActivatedTabsListener)
  chrome.tabs.onUpdated.addListener(onUpdatedTabsListener)
}

export function removeTabsListener (): void {
  chrome.tabs.onActivated.removeListener(onActivatedTabsListener)
  chrome.tabs.onUpdated.removeListener(onUpdatedTabsListener)
}

async function closeTabLister(msg: ChromeMessage, _: any, sendResponse: any): Promise<void> {
  if (msg.type === MessageTypes.CloseActiveTab) {
    const activeTab = await getCurrentTab()
    chrome.tabs.remove(activeTab.id)  
    sendResponse()
  }
}

async function onActivatedTabsListener (): Promise<void> {
  const activeTab = await getCurrentTab()
  processActiveTab(activeTab)
};

async function onUpdatedTabsListener (_tabId: any, _changeInfo: any, tab: chrome.tabs.Tab) {
  if (tab.active && tab.status === 'complete') {
    processActiveTab(tab)
  }
}

async function processActiveTab (tab: chrome.tabs.Tab): Promise<void> {
  chrome.storage.sync.get(ChromeStorageKeys.forbiddenWebsites, (result) => {
    let forbiddenWebsites: string[] =  result[ChromeStorageKeys.forbiddenWebsites] || []
    const isForbidden = forbiddenWebsites.some(website =>
        tab.url.includes(website)
    )
    if (isForbidden) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['forbiddenWebsitePopupScript.js']
      })
      startTimerPenalty()
    } else {
      stopTimerPenalty()
    }
  })

}

async function getCurrentTab (): Promise<chrome.tabs.Tab> {
  const queryOptions = { active: true, lastFocusedWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}