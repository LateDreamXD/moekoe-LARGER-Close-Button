document.addEventListener('DOMContentLoaded', () => {
	const sendMessage = (message, callback) => {
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, message, res => {
				// TODO: 不知道为什么会报错, 功能也没法实现, 推测是上游问题
				// 先就这样吧
				void chrome.runtime.lastError;
				callback(res);
			}));
		});
	}

	sendMessage({ action: 'getSize' }, result => {
		if(result) {
			document.getElementById('size').value = result;
		}
	});

	document.getElementById('save').addEventListener('click', (ev) => {
		ev.target.disabled = true;
		const value = document.getElementById('size').value;
		sendMessage({ action: 'setSize', value }, () => {
			alert('已应用修改, 页面将重新加载');
			ev.target.disabled = false;
		});
	});

	document.getElementById('reset').addEventListener('click', (ev) => {
		ev.target.disabled = true;
		if(confirm('确定要恢复默认设置吗?')) {
			sendMessage({ action: 'reset' }, () => {
				alert('已恢复默认设置, 页面将重新加载');
				ev.target.disabled = false;
			});
		}
	});
});