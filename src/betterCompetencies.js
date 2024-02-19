// ==UserScript==
// @name         Better Competencies Gandalf
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  Rend l'utilisation de l'onglet Compétences de Gandalf plus intuitif
// @author       Arthur Decaen
// @match        https://gandalf.epitech.eu/local/graph/view.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epitech.eu
// @grant        none
// ==/UserScript==

class Competency
{
    constructor(fill, progress, median, threshold, html, title) {
        this.fill = parseInt(fill.replace("%", ""))
        this.progress = parseInt(progress.replace("%", ""))
        this.median = parseInt(median.replace("%", ""))
        this.threshold = parseInt(threshold.replace("%", ""))
        this.html = html
        this.title = title

        this.median = parseInt(this.median * 100 / this.threshold)
        if (Math.abs(this.median - this.progress) <= 2) this.median = this.progress
        this.subComps = []
    }
}

class SubComp
{
    constructor(title, status)
    {
        this.title = title.split(" - ")[1]
        this.status = status

        switch (this.status) {
            case 'success': this.icon = "proficiencyIcon fa fa-check-circle-o success"; break;
            case 'failed': this.icon = "proficiencyIcon fa fa-times-circle-o failed"; break;
            case 'unrated': this.icon = "proficiencyIcon fa fa-times-circle-o unrated"; break;
        }
    }
}

(function() {
    'use strict';

    // ---------- CSS ----------

    const styles = `
    .style {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .styleSkill {
        display: grid;
        grid-template-columns: 4fr 40px 40px;
        grid-template-rows: 2fr;
        grid-column-gap: 0px;
        grid-row-gap: -1px;
        text-wrap: nowrap;
    }

    .styleSkill:nth-child(odd) {
        background: #e9e9e9;
    }

    .styleSkillTitle {
        width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }

    .styleSubComp {
        grid-area: 2 / 1 / 3 / 4;
        display: flex;
        flex-direction: column;
    }

    .styleSubCompChild {
        display: flex;
        justify-content: flex-start;
        gap: 5px;
        font-size: .8rem;
    }

    .info button {
        background: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: bold !important;
        text-wrap: nowrap;
        margin: 0;
        padding: 0;
    }
    `

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

    // ---------- Get Data ----------

    const competencies = []
    const skillContainer = document.querySelectorAll('.skillProgressContainer:not(.legendSkillProgressSample)');
    var cent = 0

    for (var i = 0; i != skillContainer.length; i++) {
        const container = skillContainer[i]

        const comp = new Competency(
            container.getElementsByClassName("skillProgress")[0].style.width,
            container.title,
            container.getElementsByClassName("skillProgressMedian")[0].style.left,
            container.getElementsByClassName("skillProgressThreshold")[0].style.left,
            container,
            container.previousElementSibling.innerHTML.replaceAll("\t", "").replaceAll("\n", "")
        )

        const progressBar = comp.html.getElementsByClassName("skillProgress")[0]

        if (comp.progress < comp.median) progressBar.style.backgroundColor = "#ffc689"
        if (comp.progress >= 100) {
            cent += 1;
            progressBar.style.backgroundColor = "#40f499"
        }

        const parent = comp.html.parentElement.parentElement.parentElement
        const subComps = parent.querySelectorAll(".competencyLine.behaviorLine")

        for (var j = 0; j != subComps.length; j++)
        {
            const status = subComps[j].querySelectorAll(".proficiencyIcon")[0].title
            const title = status == "unrated"
            ? subComps[j].children[2].innerHTML.replaceAll("\t", "").replaceAll("\n", "")
            : subComps[j].querySelectorAll(".competencyTitle")[0].innerHTML

            const subComp = new SubComp(title, status)
            comp.subComps.push(subComp)
        }

        competencies.push(comp)
    }

    // ---------- Button functions ----------

    function firstSetSubComp() {
        const state = localStorage.getItem("subCompState") === "true"
        const subCompDivs = document.querySelectorAll(".styleSubComp")
        for (var i = 0; i != subCompDivs.length; i++) {
            subCompDivs[i].style.display = state ? "none" : "flex"
        }
    }

    function toggleSubComp() {
        const state = localStorage.getItem("subCompState") === "true"
        const subCompDivs = document.querySelectorAll(".styleSubComp")
        for (var i = 0; i != subCompDivs.length; i++) {
            subCompDivs[i].style.display = state ? "flex" : "none"
        }
        localStorage.setItem("subCompState", !state)
    }

    // ---------- Add to page ----------

    const listInfo = document.getElementsByClassName("listInfo")[0]
    listInfo.innerHTML += `
<div class="content-line">
<span class="info">Validated skills: </span>
<span class="content">${cent}/${competencies.length}</span>
</div>`

    const unfinished = competencies.map((comp) => {
        return comp.progress < 100 ? `<span class="styleSkill">
        <span class="styleSkillTitle" title="${comp.title}">${comp.title}</span>
        <b style="color: #2bb8b9;" title="Ma progression">${comp.progress}%</b>
        <b style="color: blue;" title="Progression moyenne">${comp.median}%</b>
        <span class="styleSubComp">
        ${
        comp.subComps.filter(function(objet) {
            return objet.status === 'failed';
        }).map((subComp) => {
            return `
            <span class="styleSubCompChild">
            <span class="${subComp.icon}"></span>
            <span>${subComp.title}</span>
            </span>`
        }).join("")
    }
        </span>
        </span>
        `
        : ""
    }).join("")
    listInfo.innerHTML += `<div class="content-line">
<span class="info"><button id="unfinished">Unfinished skills: </button></span>
<span class="content style">${unfinished}</span>
</div>`

    firstSetSubComp()
    document.querySelector("#unfinished").addEventListener("click", toggleSubComp)
})();