import {ChromeStorageKeys} from '../../constants'
import {MessageTypes, TimerActions, TimerStatus} from '../../types'
import {startTimer, pauseTimer, stopTimer} from './timer'

chrome.runtime.onMessage.addListener(
    (msg, _sender, sendResponse) => {
        switch (msg.type) {
            case MessageTypes.TimerStatus:
                switch (msg.body.status) {
                    case TimerActions.StartTimer:
                        chrome.storage.sync.set({
                            [ChromeStorageKeys.timerStatus]: TimerStatus.Active
                        })
                        startTimer()
                        break
                    case TimerActions.PauseTimer:
                        pauseTimer()
                        chrome.storage.sync.set({
                            [ChromeStorageKeys.timerStatus]: TimerStatus.NotActive
                        })
                        break
                    case TimerActions.ResetTimer:
                        stopTimer()
                        chrome.storage.sync.set({
                            [ChromeStorageKeys.timerStatus]: TimerStatus.NotActive
                        })
                        break
                }
                sendResponse()
        }
    }
)
