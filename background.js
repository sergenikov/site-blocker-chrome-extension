/*
CALLBACK
Prints that item was stored. Callback used in storeUrl()
*/
function getCallback(result) {
		console.log("got item " + result.test);
}

function setCallback(){
		console.log("values set");
}

/* 
FUNCTION
Add URL to block to the local chrome storage.
callbacks
     anonymous only
*/
function addUrl(url) {
		chrome.storage.local.get(function(cfg) {
				if(typeof(cfg["blocked"]) !== 'undefined' && cfg["blocked"] instanceof Array) { 
						cfg["blocked"].push(url);
				} else {
						cfg["blocked"] = [url];
				}
				chrome.storage.local.set(cfg); 
				console.log("pushed stuff to blocked array");
		});
}

/*
CALLBACK
Set by getBlockedUrls. Prints list of all URLs that are blocked. 
*/
function printAllBlocked(result) {
		var blocked = result.blocked;
		for (i in blocked) {
				console.log(blocked[i]);
		}
}

/*
FUNCTION
Used by storeUrl(). Makes request to chrome.storage and adds callback.
callbacks
    printAllBlocked
*/
function getBlockedUrls() {
		console.log("Blocked urls are:");
		chrome.storage.local.get('blocked', printAllBlocked);
}

/* 
FUNCTION
Called by click browserAction event. Adds link of the current tab to the list of 
blocked sites.
*/
function storeUrl(tab) {
		// these two lines work
		chrome.storage.local.set({"test" : "sergey"});
		var testVal = chrome.storage.local.get('test', getCallback);

		// add to array of blocked urls in local chrome storage
		addUrl(tab.url);
		getBlockedUrls();
}

// moved redder code to redder.js
function redder(tab) {
		// No tabs or host permissions needed!
		console.log("background.js: redder() turning page " + tab.url + " red");
		chrome.tabs.executeScript(tab.id, {file: "redder.js"});
}

/*
CALLBACK
Used by clearCallback function and runs when chrome.storage.local clears
*/
function clearCallback(){
		console.log("New session. Storage cleared");
}

// Clear local storage
// TODO remove this after testing before using it.
chrome.storage.local.clear(clearCallback);

chrome.browserAction.onClicked.addListener(storeUrl);
