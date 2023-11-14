let isDragging = false
let initialX: number
let initialY: number

export function setDragToRotateClockListener(containerId: string) {
  const el =  document.getElementById(containerId);
  el.addEventListener('mousedown', (e) => {
    isDragging = true
    initialX = e.clientX
    initialY = e.clientY
  })

  window.addEventListener('mouseup', () => isDragging = false)

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - initialX
      const deltaY = e.clientY - initialY

      const xRotationRange = { min: -60, max: 60 }
      const yRotationRange = { min: -60, max: 60 }

      const xRotation = deltaY > 0
        ? Math.min(deltaY, xRotationRange.max)
        : Math.max(deltaY, xRotationRange.min)

      const yRotation = deltaX > 0
        ? Math.min(deltaX, yRotationRange.max)
        : Math.max(deltaX, yRotationRange.min)

      el.style.setProperty('--rotateY', `${yRotation * 0.5}deg`)
      el.style.setProperty('--rotateX', `${xRotation * -0.5}deg`)
    }
  })
}
