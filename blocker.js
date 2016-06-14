// Blocker loads when page you are browsing to loads.

function run(tab) {
	console.log("hello from background; url: " + tab.url);
	// chrome.tabs.executeScript(tab.url, {
	// 	code: 'alert("Cat not found!");'
	// });
}

function printAllBlockedCallback(result) {
    /* Used by getBlockedUrls. Prints list of all URLs that are blocked. */
    var blocked = result.blocked;
    console.log("Blocked urls are:");
    for (i in blocked) {
        console.log(blocked[i]);
    }
}

function getBlockedUrls() {
    /* Print blocked URLs to console */
    chrome.storage.local.get('blocked', printAllBlockedCallback);
}

console.log("current hostname " + location.hostname);
getBlockedUrls();
