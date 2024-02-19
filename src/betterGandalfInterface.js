// ==UserScript==
// @name         Better Gandalf Interface
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  Removal of elements not required for navigation. Modernisation of the interface
// @author       Arthur Decaen
// @match        https://gandalf.epitech.eu/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Remove forum wrapper
    const forums = document.querySelectorAll(".activity.forum.modtype_forum")
    forums.forEach((forum) => forum.remove())

    // Style
    const styles = `
.sectionname {
    border-radius: 8px;
    margin-top: 5px;
}

.containerLinks,
.section.main {
    border-radius: 8px !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12);
    margin-top: 15px !important;
    margin-bottom: 15px !important;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #f2f3f5 !important;
}

#region-main {
    border-radius: 8px;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12);
    background-color: #ffffff;
}

.pagelayout-mydashboard #region-main {
    box-shadow: none;
}

.block {
    border-radius: 8px !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12) !important;
    border: none !important;
}

.section-summary-activities.mdl-right {
    height: 20px;
    padding-right: 10px;
}

#page>.container {
    background-color: #f2f3f5 !important;
}

#page-footer {
    display: none;
}

#main-navbar {
    background-color: #e3e5e8 !important;
    border: none !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12);
}

.zoomdesc {
    display: none;
}

#page-navbar {
    border-radius: 8px;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.05);
    background-color: #ffffff;
    margin-top: 20px !important;
}

.container.outercont .row:first-child {
    display: flex;
    justify-content: left;
}

#adaptable-page-header-wrapper {
    background: #e3e5e8 !important;
}

a[title="Epitech Gandalf Platform"] img {
    filter: invert(100%);
}

#block-region-side-post {
    padding-right: 0;
}

#sitetitle h1 {
    color: black !important;
}

.search-box,
.search-box input {
    border-radius: 10px !important;
}

#completionprogressid {
    display: none;
}

#section-0 {
    margin-top: 0 !important;
}

.card-text.calendarwrapper {
    padding-left: 15px !important;
    padding-right: 15px !important;
}

.userpicture {
    border-radius: 20px !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.2);
}

.courses.category-browse.category-browse-3 .coursebox {
    margin-top 10px;
    margin-bottom: 10px;
}

.collapsible-actions {
    margin: 0 !important;
    padding-right: 25px !important;
}

body {
    background: #f2f3f5 !important;
}
    `

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();