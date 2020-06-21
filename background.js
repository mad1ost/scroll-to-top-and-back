'use strict';

const savedPageYOffsets = {}; // with tabId as keys

browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.executeScript({
    code: 'window.pageYOffset',
    runAt: 'document_end'
  }).then(([currentPageYOffset]) => {
    let top;
    if (currentPageYOffset === 0) {
      if (!(tab.id in savedPageYOffsets)) return;
      top = savedPageYOffsets[tab.id];
    } else {
      savedPageYOffsets[tab.id] = currentPageYOffset;
      top = 0;
    }
    browser.tabs.executeScript({
      code: `window.scrollTo({top: ${top}})`,
      runAt: 'document_end'
    });
  });
});

browser.tabs.onRemoved.addListener((tabId) => {
  delete savedPageYOffsets[tabId];
});

browser.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  delete savedPageYOffsets[details.tabId];
});
