import {sendMessage} from "../../common/chromeMessage";
import {ChromeStorageKeys} from "../../constants";
// @ts-ignore
import {ChromeMessage, MessageTypes, TimerStatus} from "../../types";
import {addTabsListers, removeTabsListener} from "./tabsChangeListener";

let timerIncrement: 1 | -1 = -1;
let timeLeftInSeconds: number;
let timerPaused = false;

chrome.alarms.clear('pomodoroTimer');

chrome.alarms.onAlarm.addListener(alarmsListener);

chrome.runtime.onMessage.addListener(getCurrentTimeListener);

initializePomodoroTime();

export function startTimer(): void {
    if (!timerPaused) {
        chrome.storage.sync.get(
            ChromeStorageKeys.pomodoroTime,
            (result) => timeLeftInSeconds = Number(result[ChromeStorageKeys.pomodoroTime]) * 60
        );
    }
    timerPaused = false
    addTabsListers();
    chrome.alarms.create("pomodoroTimer", {
        periodInMinutes: 1 / 60,
    });
}

export function startTimerPenalty(): void {
    timerIncrement = 1
}

export function stopTimerPenalty(): void {
    timerIncrement = -1
}

export function pauseTimer(): void {
    timerPaused = true
    removeTabsListener()
    chrome.alarms.clear('pomodoroTimer')
}

export function stopTimer(): void {
    timerPaused = false
    removeTabsListener()
    chrome.alarms.clear('pomodoroTimer')
}

function alarmsListener(alarm: any) {
    if (alarm.name === 'pomodoroTimer') {
        if (timeLeftInSeconds === 0) {
            chrome.notifications.create("", {
                type: "basic",
                iconUrl: "clock.png",
                title: "Pomodoro complete",
                message: "Study session completed, take a break",
            });
            chrome.storage.sync.set({
                [ChromeStorageKeys.timerStatus]: TimerStatus.NotActive
            })
            removeTabsListener()
            chrome.storage.sync.get(
                ChromeStorageKeys.pomodoroTime,
                (result) => {
                    timeLeftInSeconds = Number(result[ChromeStorageKeys.pomodoroTime]) * 60
                    updateCountInComponent(true);
                }
            );
            chrome.alarms.clear('pomodoroTimer')
        } else {
            updateCountInComponent(false);
        }
        timeLeftInSeconds += timerIncrement;
    }
}

async function updateCountInComponent(isOver: boolean): Promise<void> {
    try {
        // @ts-expect-error. getContexts is not yet defined in @types/chrome(0.0.251), remove after update
        const context = await chrome.runtime.getContexts({
            contextTypes: ["POPUP"],
        });
        if (context.length) {
            let messageBody = isOver ?
                    {isOver: isOver, pomodoroTime: timeLeftInSeconds} :
                    {secondsToAdd: timerIncrement}
            sendMessage({
                type: MessageTypes.CountUpdate,
                body: messageBody
            });
        }
    } catch (error) {
        console.error(error)
    }
}

function getCurrentTimeListener(msg: ChromeMessage, _sender: any, sendResponse: any) {
    if (msg.type === MessageTypes.GetTimeLeft) {
        sendResponse({timeLeft: timeLeftInSeconds});
    }
}

function initializePomodoroTime(): void {
    chrome.storage.sync.get(
        ChromeStorageKeys.pomodoroTime,
        (result) => {
            const storedPomodoroTime = Number(result[ChromeStorageKeys.pomodoroTime]);
            if (!isNaN(storedPomodoroTime)) {
                timeLeftInSeconds = storedPomodoroTime * 60
            } else {
                chrome.storage.sync.set({[ChromeStorageKeys.pomodoroTime]: 20})
            }
        }
    );

}
