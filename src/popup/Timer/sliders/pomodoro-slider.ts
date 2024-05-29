import './pomodoro-sliders.scss'
import {ChromeStorageKeys} from "../../../constants"
import {TimerStatus} from "../../../types"
import {setTimerToTime} from "../timer-ui/timer-slots/timer-slots"

let slider: HTMLInputElement;
let pomodoroTime: HTMLElement

export function loadSliders(slidersContainer: string) {
    chrome.storage.sync.get(
        ChromeStorageKeys.pomodoroTime,
        (result) => {
            const pomodoroTimeResult = result[ChromeStorageKeys.pomodoroTime]
            pomodoroTime.innerHTML = pomodoroTimeResult
            slider.value = pomodoroTimeResult
        }
    )

    document.getElementById(slidersContainer).innerHTML = getInnerHTML()
    slider = document.getElementById('pomodoroSlider') as HTMLInputElement
    pomodoroTime = document.getElementById('pomodoroTime')
    slider.addEventListener('input', () => {
        pomodoroTime.innerHTML = slider.value;
    })
    slider.addEventListener('change', () => {
        chrome.storage.sync.set({
                [ChromeStorageKeys.pomodoroTime]: slider.value
        })
        chrome.storage.sync.get(ChromeStorageKeys.timerStatus, (result) => {
            if (result[ChromeStorageKeys.timerStatus] === TimerStatus.NotActive) {
                setTimerToTime(Number(slider.value) * 60)
            }
        })
    })
}

function getInnerHTML() {
    return ` 
        <input type="range" class="range-style"  min="1" max="99" value="20" id="pomodoroSlider">
        <div id="pomodoroTime"></div>
    `
}