// ==UserScript==
// @name         Fetch all project files
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  Rassemble tous les fichiers d'un projet sur la page de ce dernier. Plus besoin d'aller voir chaque lien.
// @author       Arthur Decaen
// @match        https://gandalf.epitech.eu/course/view.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

class File {
    constructor(title, url, date, icon) {
        this.title = title
        this.url = url
        this.date = date
        this.icon = icon
    }
}

async function fetchSite(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur de requête: ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`Erreur: ${error.message}`);
    }
}

function extractFilesFromPageContent(pageContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageContent, 'text/html');
    const filesdiv = doc.querySelectorAll('.fp-filename-icon, .fileuploadsubmission');
    const filesData = []

    filesdiv.forEach(file => {
        try {
            const name = file.textContent
            const url = file.querySelectorAll('a[href]')[0]?.href
            const date = file?.nextSibling?.innerText
            const icon = file.querySelectorAll('.icon.icon')[0]?.src
            if (!url) return
            filesData.push(new File(name, url, date ?? "", icon))
        } catch(e) { console.log(e) }
    });

    return filesData
}

function preparePage() {
    const accordion = document.querySelectorAll('.accordion.collapsibletopics')[0]
    const newDiv = document.createElement('div');
    newDiv.textContent = 'Contenu du nouveau div';

    newDiv.innerHTML = `<div class="containerLinks">
    <span class="sectionname linkName">All files</span>
    </div>`

    accordion.insertBefore(newDiv, accordion.firstChild.nextSibling);

    return newDiv
}

function addToPage(files, zone) {
    const filesDiv = files.map((file) => {
        return `<div class="links">
        <img src="${file.icon}"></img>
        <a href="${file.url}" title="${file.title}">${file.title}</a>
        <span>${file.date}</span>
        </div>`
    }).join("")
    zone.innerHTML += `${filesDiv}`
}

(function() {
    'use strict';

    const styles = `
    .containerLinks {
        background: #f4f4f0;
        margin-bottom: 10px;
        font-size: 1rem;
        padding: 10px;
        padding-left: 25px;
        padding-right: 25px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .links {
        display: grid;
        grid-template-columns: 20px 1fr 1fr;
        grid-template-rows: 1fr;
        grid-column-gap: 8px;
        text-wrap: nowrap;
    }

    .links img {
        width: 20px;
    }

    .links a {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sectionname.linkName {
        margin-bottom: 5px;
        font-size: 1.5rem;
        width: fit-content;
    }
    `

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

    const linksDiv = document.querySelectorAll(".activityinstance")
    const links = []
    for (var i = 0; i != linksDiv.length; i++) {
        const a = linksDiv[i].getElementsByTagName("a")[0]
        if (a?.href) links.push(a.href)
    }

    preparePage()
    const zone = document.querySelectorAll('.containerLinks')[0]

    links.forEach(async (link) => {
        const pageContent = await fetchSite(link)
        const files = extractFilesFromPageContent(pageContent)
        addToPage(files, zone)
    })
})();