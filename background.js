'use strict';

let positions = {};

function handleMessage(position, sender) {
	//if (sender.id === 'scroll-to-top-and-back-youtube@mad1ost')
	if (sender.id === '{870594cc-ec11-472c-8c1b-da7a75afb063}') {
		positions[sender.tab.id] = parseInt(position);
	}
}

function onClicked(tab) {
	let code = `!(function() {
		let savedY = ${(tab.id in positions) ? positions[tab.id] : 'window.savedY'};
		let newY;
		if (window.scrollY === 0) {
			if (!savedY) return;
			newY = savedY;
		} else {
			savedY = window.scrollY;
			newY = 0;
		}
		window.scrollTo({
			top: newY
		});
		window.savedY = savedY;
	}());
	`;
	delete positions[tab.id];

	browser.tabs.executeScript({
		code: code,
		runAt: 'document_end'
	})
	.catch((error) => {
		console.error(error);
	});
}

browser.pageAction.onClicked.addListener(onClicked);
browser.browserAction.onClicked.addListener(onClicked);
browser.runtime.onMessageExternal.addListener(handleMessage);
