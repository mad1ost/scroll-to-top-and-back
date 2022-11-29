'use strict';

const code = `
	!(function() {
		let prevY = window.prevY;
		let top;
		if (window.scrollY === 0) {
			if (!prevY) return;
			top = prevY;
		} else {
			prevY = window.scrollY;
			top = 0;
		}
		window.scrollTo({
			top: top
		});
		window.prevY = prevY;
	}());
`;

function onClicked() {
	browser.tabs.executeScript({
		code: code,
		runAt: 'document_end'
	});
}

browser.pageAction.onClicked.addListener(onClicked);

browser.browserAction.onClicked.addListener(onClicked);
