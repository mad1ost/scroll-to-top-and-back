'use strict';

let positions = {};

function handleMessage(position, sender) {
	//if (sender.id === 'scroll-to-top-and-back-youtube@mad1ost')
	if (sender.id === '{870594cc-ec11-472c-8c1b-da7a75afb063}') {
		positions[sender.tab.id] = parseInt(position);
	}
}

function scrollTo(position) {
	let savedY = (position) ? position : window.savedY;
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
}

function onClicked(tab) {
	const position = (tab.id in positions) ? positions[tab.id] : 0;
	browser.scripting.executeScript({
		target: {
			tabId: tab.id
		},
		func: scrollTo,
		args: [position],
		injectImmediately: true
	})
	.catch((error) => {
		console.error(error);
	});
}

browser.pageAction.onClicked.addListener(onClicked);
browser.browserAction.onClicked.addListener(onClicked);
browser.runtime.onMessageExternal.addListener(handleMessage);
