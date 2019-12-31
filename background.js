'use strict';

const pageXYOffsets = {}; // with tabId as keys

browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.executeScript({
    code: '[window.pageXOffset, window.pageYOffset]',
    runAt: 'document_end'
  }).then(([[currentXOffset, currentYOffset]]) => {
    let x = 0;
    let y = 0;
    if (currentXOffset === 0 && currentYOffset === 0) {
      if (tab.id in pageXYOffsets) {
        x = pageXYOffsets[tab.id][0];
        y = pageXYOffsets[tab.id][1];
      } else {
        return;
      }
    } else {
      pageXYOffsets[tab.id] = [currentXOffset, currentYOffset];
    }
    browser.tabs.executeScript({
      code: `window.scrollTo(${x}, ${y})`,
      runAt: 'document_end'
    });
  });
});

browser.tabs.onRemoved.addListener((tabId) => {
  delete pageXYOffsets[tabId];
});

browser.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  delete pageXYOffsets[details.tabId];
});
