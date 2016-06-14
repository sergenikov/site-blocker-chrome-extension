// Blocker loads when page you are browsing to loads.

function run(tab) {
	console.log("hello from background; url: " + tab.url);
	// chrome.tabs.executeScript(tab.url, {
	// 	code: 'alert("Cat not found!");'
	// });
}

function printBlockedUrlsCallback(result) {
    /* Used by printBlockedUrls. Prints list of all URLs that are blocked. */
    var blocked = result.blocked;
    for (i in blocked) {
        console.log("[BLOCKED] " + blocked[i]);
    }
}

function printBlockedUrls() {
    /* Print blocked URLs to console */
    chrome.storage.local.get('blocked', printBlockedUrlsCallback);
}

function checkUrlCallback(result) {
    /* Used by checkUrl. Blocks loading of current page if it's blocked. */
    var blocked = result.blocked;
    for (i in blocked) {
        if (location.hostname === blocked[i]) {
            console.log("[WARNING] " + location.hostname
                + " is blocked. Replacing page.");
        }
    }
}

function checkUrl() {
    /* Checked if the hostname is supposed to be blocked. */
    chrome.storage.local.get('blocked', checkUrlCallback);
}

printBlockedUrls();
checkUrl();
