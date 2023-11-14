import { setUpTimer } from './Timer/timer'

import './popup.scss'
import {setUpWebsitesOptions} from "./ForbiddenPages/forbidden-websites"

const currentPageId = 'currentPage'
const navigationButtonWebsitesId = 'navigationButtonWebsites'
const navigationButtonTimerId = 'navigationButtonTimer';


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('body').innerHTML = getInnerHTML()
    setUpTimer(currentPageId)

    const navigationButtons = document.querySelectorAll('input[name="checkboxGroup"]');
    navigationButtons.forEach((button) => {
        button.addEventListener('change', () => {
            if (button.id === navigationButtonTimerId) {
                setUpTimer(currentPageId)
            }
            if (button.id === navigationButtonWebsitesId) {
                setUpWebsitesOptions(currentPageId)
            }
        })
    })

});


function getInnerHTML() {
    return `
        <div id="navigationContainer">           
            <input type="radio" name="checkboxGroup" checked id="${navigationButtonTimerId}">
            <label id="checker"></label>
            <label for="${navigationButtonTimerId}">Timer</label>
            <input type="radio" name="checkboxGroup"  id="${navigationButtonWebsitesId}">
            <label for="${navigationButtonWebsitesId}">Websites</label>
        </div>

    <div id="${currentPageId}"></div>
  `
}
