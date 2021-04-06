'use strict';

const exportButton = document.getElementById('export');
const title = document.getElementById('title');
const headerTitle = document.getElementById('header-title');

exportButton.onclick = function () {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        file: 'contentScript.js'
      });
  });
};

exportButton.innerText = chrome.i18n.getMessage('saveCSV');
title.innerText = chrome.i18n.getMessage('title');
headerTitle.innerText = chrome.i18n.getMessage('title');
