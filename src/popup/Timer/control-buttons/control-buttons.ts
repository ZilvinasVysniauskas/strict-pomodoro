import {MessageTypes, TimerActions, TimerStatus} from "../../../types";
import {sendMessage} from "../../../common/chromeMessage";
import {ChromeStorageKeys} from "../../../constants";

import './control-buttons.scss'
import {setTimerToTime} from "../timer-ui/timer-slots/timer-slots"

const startPauseButtonId = 'startPauseButton'
const resetButtonId = 'resetButton'
const resetIconSrc = './icons/reset.svg'
let playPauseButton: HTMLElement
let resetButton: HTMLElement
let timerStatus: string

export function loadTimerButtons(containerId: string) {
    document.getElementById(containerId).innerHTML = getInnerHTML();
    playPauseButton = document.getElementById(startPauseButtonId)
    resetButton = document.getElementById(resetButtonId)
    setUpPlayButtonListeners()
    setUpResetButtonListener()
    setPlayButtonIcon();
}

export function updatePlayButtonIcon(timerStatus: string): void {
    playPauseButton.classList.toggle('pause', timerStatus == TimerStatus.Active);
}

function setUpPlayButtonListeners(): void {
    playPauseButton.addEventListener('click', () => {
        if (timerStatus === TimerStatus.Active) {
            timerStatus = TimerStatus.NotActive
            sendMessage({
                type: MessageTypes.TimerStatus, body: {status: TimerActions.PauseTimer}
            })
        } else {
            timerStatus = TimerStatus.Active
            sendMessage({
                type: MessageTypes.TimerStatus, body: {status: TimerActions.StartTimer}
            })
        }
        updatePlayButtonIcon(timerStatus);
    })
}

function setUpResetButtonListener(): void {
    resetButton.addEventListener('click', () => {
        sendMessage({
            type: MessageTypes.TimerStatus, body: {status: TimerActions.ResetTimer}
        })
        timerStatus = TimerStatus.NotActive
        updatePlayButtonIcon(TimerStatus.NotActive)
        chrome.storage.sync.get(ChromeStorageKeys.pomodoroTime, (result) =>
            setTimerToTime(result[ChromeStorageKeys.pomodoroTime] * 60)
        );
    })
}

function setPlayButtonIcon(): void {
    chrome.storage.sync.get(ChromeStorageKeys.timerStatus, (result) => {
        timerStatus = result[ChromeStorageKeys.timerStatus]
        console.log(timerStatus);
        updatePlayButtonIcon(timerStatus)
    })
}

function getInnerHTML() {
    return `
     <button id="${startPauseButtonId}" class="action-button">
        <img>
      </button>
      <button class="negative-button" id="${resetButtonId}">
        <img src=${resetIconSrc}>
      </button>
`
}