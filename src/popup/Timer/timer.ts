import {type ChromeMessage, MessageTypes, TimerStatus} from "../../types";
import {addSecondsToTimer, setTimerToTime} from "./timer-ui/timer-slots/timer-slots";
import {loadClockUI} from "./timer-ui/timer-ui";
import {loadTimerButtons, updatePlayButtonIcon} from "./control-buttons/control-buttons";
import {loadSliders} from "./sliders/pomodoro-slider"

const timerContainerId = 'timerContainer'
const timerButtonsContainerId = 'timerButtonsContainer'
const sliderContainerId = 'sliderContainer'


export function setUpTimer(containerId: string): void {
    document.getElementById(containerId).innerHTML = getInnerHTML()
    loadClockUI(timerContainerId)
    loadTimerButtons(timerButtonsContainerId)
    loadSliders(sliderContainerId)

    setTimerToCurrentState()
    chrome.runtime.onMessage.addListener(timerUpdateListener);
}

function timerUpdateListener(
    msg: ChromeMessage,
    _sender: any,
    sendResponse: any
): void {
    if (msg.type === MessageTypes.CountUpdate) {
        if (msg.body.isOver) {
            setTimerToTime(msg.body.pomodoroTime)
            updatePlayButtonIcon(TimerStatus.NotActive)
        } else {
            addSecondsToTimer(msg.body.secondsToAdd);
            sendResponse({success: true});
        }
    }
}

function setTimerToCurrentState() {
    chrome.runtime.sendMessage({type: MessageTypes.GetTimeLeft}, (response) => {
        setTimerToTime(response.timeLeft);
    });
}

function getInnerHTML() {
    return `
    <div id="${timerContainerId}"></div>
    <div id="${timerButtonsContainerId}"></div> 
    <div id="${sliderContainerId}"></div>
  `
}


