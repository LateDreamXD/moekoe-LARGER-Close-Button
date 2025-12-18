(function () {
	'use strict';

	const getSize = () => localStorage.getItem('LARGER-Close-Button:size') ?? 16;
	const setSize = (size) => localStorage.setItem('LARGER-Close-Button:size', size);
	const reset = () => localStorage.removeItem('LARGER-Close-Button:size');

	function updateStyle() {
		const size = getSize();
		document.querySelectorAll('.titlebar>.window-controls>.control-button').forEach(btn => {
			btn.style.width = isNaN(size)? size: `${size}px`;
			btn.style.height = isNaN(size)? size: `${size}px`;
		});
	}

	function init() {
		try {
			updateStyle();
			console.log('[LARGER-Close-Button] Inject style success');
		} catch (e) {
			console.error('[LARGER-Close-Button] Failed to inject style:', e.message, e?.stack);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		console.log('[LARGER-Close-Button] Received message:', request);

		switch(request.action) {
			case 'getSize':
				sendResponse(getSize());
				break;
			case 'setSize':
				setSize(request.value);
				sendResponse({ status: 'success' });
				break;
			case 'reset':
				reset();
				sendResponse({ status: 'success' });
				break;
			default:
				return sendResponse({ status: 'error', message: 'unknown action' });
		}
		updateStyle();
	});
})();
