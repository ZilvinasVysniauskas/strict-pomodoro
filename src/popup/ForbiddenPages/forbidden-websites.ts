import './forbidden-websites.scss'
import {ChromeStorageKeys} from "../../constants"

let list: HTMLElement
let websiteInput: HTMLInputElement

export function setUpWebsitesOptions(containerId: string) {
    chrome.storage.sync.get(ChromeStorageKeys.forbiddenWebsites, (result) => {
        const websites: string[] = result[ChromeStorageKeys.forbiddenWebsites] || [];
        renderElements(websites);
    })
    document.getElementById(containerId).innerHTML = getInnerHTML()
    renderElements([]);

    websiteInput = document.getElementById('websiteInput') as HTMLInputElement

    document.getElementById('addWebsiteBtn').addEventListener('click', () => {
        if (websiteInput.value) {
            updateForbiddenWebsites(
                websiteInput.value,
                (websites: string[], website: string) => {
                    websites.push(website)
                    return websites
                }
            )
            list.appendChild(createListEl(websiteInput.value))
        }
    })
}

function updateForbiddenWebsites(website: string, updateListFn: (websites: string[], website: string) => string[]) {
    chrome.storage.sync.get(ChromeStorageKeys.forbiddenWebsites, (result) => {
        const existingWebsites = result[ChromeStorageKeys.forbiddenWebsites] || []
        chrome.storage.sync.set({
            [ChromeStorageKeys.forbiddenWebsites]: updateListFn(existingWebsites, website)
        })
    })
}

function renderElements(websites: string[]) {
    list = document.getElementById('listOfWebsites')
    websites.forEach((website) => {
        list.appendChild(createListEl(website))
    })
}

function createListEl(website: string): HTMLElement {
    const listEl = document.createElement('div')
    listEl.classList.add('list-item-container')
    const p = document.createElement('p');
    p.textContent = website
    listEl.appendChild(p)
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('negative-button')
    deleteBtn.textContent = 'REMOVE'
    deleteBtn.addEventListener('click', () => {
        const list = listEl.parentElement
        list.removeChild(listEl)
        updateForbiddenWebsites(
            p.textContent,
            (websites: string[], website: string) => websites.filter(w => w !== website)
        )

    })
    listEl.appendChild(deleteBtn)
    return listEl
}

function getInnerHTML() {
    return `
        <div id="websiteOptions" >
            <div class="optionsContainer">
            <div id="listOfWebsites"></div>
            <div id="addWebsite">
                <input id="websiteInput">
                <button id="addWebsiteBtn" class="action-button">ADD</button>
            </div>
            </div>
            
        </div>
    `
}