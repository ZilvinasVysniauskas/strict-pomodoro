import './timer-slots.scss'

const clockSlotsIdsInOrder = [
    'clockSlotSecondsOne', 'clockSlotSecondsTwo', 'clockSlotMinutesOne', 'clockSlotMinutesTwo'
]

let elementsInOrder: HTMLElement[]

export function loadSlots(containerId: string) {
    document.getElementById(containerId).innerHTML = getInnerHTML()
    elementsInOrder = clockSlotsIdsInOrder.map(id => document.getElementById(id))
}

export function addSecondsToTimer(seconds: number, elIndex = 0): void {
    const currentElNumber = getElementCurrentNumber(elIndex)
    const nextNumber = currentElNumber + seconds
    const maxElementDigit = elIndex % 2 ? 5 : 9
    if (nextNumber >= 0 && nextNumber <= maxElementDigit) {
        setSpecificFlipToNumber(elIndex, nextNumber)
    }
    if (elIndex < 3) {
        if (nextNumber < 0) {
            addSecondsToTimer(-1, elIndex + 1)
            setSpecificFlipToNumber(elIndex, maxElementDigit)
        }
        if (nextNumber > maxElementDigit) {
            setSpecificFlipToNumber(elIndex, 0)
            addSecondsToTimer(1, elIndex + 1)
        }
    }
}

export function setTimerToTime(seconds: number): void {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes) {
        const slotTwoMinutes = Math.floor(minutes / 10)
        const slotOneMinutes = minutes % 10
        setSpecificFlipToNumber(3, slotTwoMinutes, true)
        setSpecificFlipToNumber(2, slotOneMinutes, true)
    } else {
        setSpecificFlipToNumber(3, 0, true)
        setSpecificFlipToNumber(2, 0, true)
    }
    if (remainingSeconds) {
        const slotTwoSeconds = Math.floor(remainingSeconds / 10)
        const slotOneSeconds = remainingSeconds % 10
        setSpecificFlipToNumber(1, slotTwoSeconds, true)
        setSpecificFlipToNumber(0, slotOneSeconds, true)
    } else {
        setSpecificFlipToNumber(1, 0, true)
        setSpecificFlipToNumber(0, 0, true)
    }
}

function setSpecificFlipToNumber(elIndex: number, toNumber: number, initialSet: boolean = false): void {
    const el = elementsInOrder[elIndex]
    const topCard = el.querySelector('.top')
    const bottomCard = el.querySelector('.bottom')
    if (initialSet) el.dataset.currentNumber = '0'
    el.dataset.nextNumber = toNumber.toString()
    const onAnimationStart = (e: AnimationEvent) => {
        if (e.animationName === 'flip-top') {
            topCard.textContent = toNumber.toString()
        }
    }

    const onAnimationEnd = (e: AnimationEvent): void => {
        if (e.animationName === 'flip-top') {
            el.dataset.currentNumber = toNumber.toString()
        }
        if (e.animationName === 'flip-bottom') {
            bottomCard.textContent = toNumber.toString()
            el.classList.remove('flip')
            el.removeEventListener('animationstart', onAnimationStart)
            el.removeEventListener('animationend', onAnimationEnd)
        }
    }

    el.addEventListener('animationstart', onAnimationStart)
    el.addEventListener('animationend', onAnimationEnd)
    el.dataset.nextNumber = toNumber.toString()
    el.classList.add('flip')
}

function getElementCurrentNumber(elIndex: number): number {
    return Number(elementsInOrder[elIndex].getAttribute('data-next-number'))
}

function getInnerHTML(): string {
    return `
        <div class="minutes-container">
          <div class="clock-slot" id="${clockSlotsIdsInOrder[3]}">
            <div class="top">0</div>
            <div class="bottom">0</div>
          </div>
          <div class="clock-slot" id="${clockSlotsIdsInOrder[2]}">
            <div class="top">0</div>
            <div class="bottom">0</div>
          </div>
        </div>
  
        <div class="seconds-container">
          <div class="clock-slot" id="${clockSlotsIdsInOrder[1]}">
            <div class="top">0</div>
            <div class="bottom">0</div>
          </div>
          <div class="clock-slot" id="${clockSlotsIdsInOrder[0]}">
            <div class="top">0</div>
            <div class="bottom">0</div>
          </div>
        </div>
      </div>
      `
}

