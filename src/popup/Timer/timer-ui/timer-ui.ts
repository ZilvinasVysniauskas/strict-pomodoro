import {setDragToRotateClockListener} from './timer-rotation'
import './timer-ui.scss'
import {loadSlots} from "./timer-slots/timer-slots";

const slotsContainerId = 'clockSlotsContainer'

export function loadClockUI(containerId: string): void {
    document.getElementById(containerId).innerHTML = getInnerHTML();
    loan3DLayers()
    loadSlots(slotsContainerId);
    setDragToRotateClockListener(containerId)
}

function loan3DLayers(): void {
    add3dLayers('main-clock', 'clock-layer', 30)
    add3dLayers('glass-container', 'glass-layer', 30)
}

function add3dLayers(parentClass: string, layerClass: string, numberOfLayers: number): void {
    const parent = document.querySelector(`.${parentClass}`)
    const layer = document.createElement('div')
    layer.className = layerClass
    Array.from(
        {length: numberOfLayers},
        () => parent.appendChild(layer.cloneNode())
    )
}

function getInnerHTML(): string {
    return `
      <div class="main-clock"></div>
      <div class="glass-container"></div>  
      <div id="${slotsContainerId}"></div>
      `
}
