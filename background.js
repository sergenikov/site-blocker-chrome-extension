var urlManager = {

	tab : null,

	addUrl: function (url) {
		/* Add URL to block to the local chrome storage. */
		chrome.storage.local.get(function(cfg) {
			if(typeof(cfg["blocked"]) !== 'undefined' && cfg["blocked"] instanceof Array) {
				cfg["blocked"].push(url);
			} else {
				cfg["blocked"] = [url];
			}
			chrome.storage.local.set(cfg);
			console.log("addUrl(): added " + url);
		});
	},

	getBlockedUrls : function () {
		/* Used by storeUrl(). Makes request to chrome.storage and adds callback.
		callbacks: printAllBlocked */
		console.log("Blocked urls are:");
		chrome.storage.local.get('blocked', printAllBlockedCallback);
	},

	clearStorage : function() {
		/* Clears local storage completely - TODO remove this in the future */
		chrome.storage.local.clear(clearCallback);
	},

	storeUrl : function() {
		/* Called by click browserAction event. Adds link of the current tab to the list of
		blocked sites. */
		chrome.storage.local.set({"test" : "sergey"});
		var testVal = chrome.storage.local.get('test', getCallback);

		// add to array of blocked urls in local chrome storage
		this.addUrl(this.tab.url);
		this.getBlockedUrls();
	}
}


/*****************************************************************************/
/* urlManager CALLBACKS */
/*****************************************************************************/

function getCallback(result) {
	/* Prints that item was stored. Callback used in storeUrl() */
	console.log("got item " + result.test);
}

function setCallback() {
	console.log("values set");
}

function clearCallback (){
	/* Used by clearCallback function and runs when chrome.storage.local clears */
	console.log("New session. Storage cleared");
}

function printAllBlockedCallback(result) {
	/* Used by getBlockedUrls. Prints list of all URLs that are blocked. */
	var blocked = result.blocked;
	for (i in blocked) {
		console.log(blocked[i]);
	}
}

/*****************************************************************************/
/* start */
/*****************************************************************************/
// urlManager.clearStorage();

function start(tab) {
	console.log("creating urlManager");
	var URLManager = {};
	urlManager.tab = tab;
	urlManager.storeUrl();
}

// Not running anymore.
// chrome.browserAction.onClicked.addListener(start);

function run(tab) {
	console.log("hello from background; url: " + tab.url);
	// chrome.tabs.executeScript(tab.url, {
	// 	code: 'alert("Cat not found!");'
	// });
}

// chrome.webNavigation.onCompleted.addListener(function(details) {
// document.addEventListener("DOMContentLoaded", run);
