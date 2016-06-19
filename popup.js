var urlManager = {

    tab : null,

    addUrl: function (url) {
        /* Add URL to block to the local chrome storage. Don't add duplicate
        entries. */
        chrome.storage.local.get(function(cfg) {
            if(typeof(cfg["blocked"]) !== 'undefined' && cfg["blocked"] instanceof Array) {
                if (!inArray(cfg["blocked"], url)) {
                    cfg["blocked"].push(url);
                }
            } else {
                cfg["blocked"] = [url];
            }
            chrome.storage.local.set(cfg);
        });
    },

    getBlockedUrls : function () {
        /* Used by storeUrl(). Makes request to chrome.storage and adds callback.
        callbacks: printAllBlockedCallback */
        chrome.storage.local.get('blocked', printAllBlockedCallback);
    },

    clearStorage : function() {
        /* Clears local storage completely */
        chrome.storage.local.clear(clearCallback);
    },

    storeUrl : function() {
        /* Called by click browserAction event. Adds link of the current tab to
        the list of blocked sites. */
        this.addUrl(this.tab);
        this.getBlockedUrls();
    }
}

function getHostname(url) {
    /* Construct hostname and path from the url of the tab.
    Trick learned from: http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
    */
    var l = document.createElement("a");
    l.href = url;
    return l;
}

function getCurrentTabUrl(callback) {
    /* Get current tab url */
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        url = getHostname(url);
        console.assert(typeof url.hostname == 'string', 'tab.url should be a string');
        callback(url.hostname);
    });
}

function inArray(blocked, value) {
    /* Checks is value is in array */
    var n = blocked.length;
    for(var i = 0; i < n; i++) {
        if(blocked[i] === value) {
            return true;
        }
    }
    return false;
}

function removeCurrentUrl() {
    /* Remove current url from blocked array in local storage */
    // TODO remove nested callbacks later if possible.
    getCurrentTabUrl(function(url) {
        chrome.storage.local.get(function(cfg) {
            if(typeof(cfg["blocked"]) !== 'undefined' && cfg["blocked"] instanceof Array) {
                var blocked  = cfg['blocked'];
                for (i=0; i < blocked.length; i++) {
                    if (blocked[i] === url) {
                        console.log("removeCurrentUrl: removing " + url);
                        blocked.splice(i, 1);
                    }
                }
            } else {
                console.log("removeCurrentUrl: ERROR: Did not get array "
                + "from storage");
            }
            chrome.storage.local.set(cfg);
        });
    });
}

function clearStorage() {
    urlManager.clearStorage();
}

function controlBlocking() {
    /* Toggle on and off of blocking.
    Uses Chrome local storage to store state. */
    var key = "blocking_status";
    console.log("popup.js: controlBlocking: toggling blocking");
    chrome.storage.local.get(key, function(status) {
        if (typeof(status) !== 'undefined' || status === true) {
            console.log("controlBlocking: blocking ON. Turning off.");
            chrome.storage.local.set({key : false}, setCallback);
        } else {
            console.log("controlBlocking: blocking OFF. Turning on.");
            chrome.storage.local.set({key : true}, setCallback);
        }
    });
}

function initBlockingStatus() {
    /* Initialized blocking status value in storage if it is not set. */
    console.log("popup.js: initBlockingStatus: init blocking status in storage");
    chrome.storage.local.get('blockingStatus', function(result) {
        console.log("current status " + result.status);
        if (result == null || result.status == null
                            || result.status == 'undefined'
                            || typeof(result) === 'undefined') {
            console.log("popup.js: initBlockingStatus: undefined. Setting to false");
            chrome.storage.local.set({'blockingStatus' : 'false'}, setCallback);
            printStorageValue('blockingStatus');
        }
    });
}

function printStorageValue(key) {
    /* Prints storage value with key to console for debugging. */
    chrome.storage.local.get(key, function(result) {
        console.log("[INFO] printStorageValue: value at key "
            + key + " : " + JSON.stringify(result));
    });
}

/*****************************************************************************/
/* urlManager CALLBACKS */
/*****************************************************************************/

function getCallback(result) {
    /* Prints that item was stored. Callback used in storeUrl() */
    console.log("got item " + result.test);
}

function setCallback(result) {
    console.log("values set");
}

function clearCallback (){
    /* Used by clearCallback function and runs when chrome.storage.local clears */
    console.log("New session. Storage cleared");
}

function printAllBlockedCallback(result) {
    /* Used by getBlockedUrls. Prints list of all URLs that are blocked. */
    var blocked = result.blocked;
    console.log("Blocked urls are:");
    for (i in blocked) {
        console.log(blocked[i]);
    }
}

/*****************************************************************************/
/* start */
/*****************************************************************************/
function start(tab) {
    var URLManager = {};
    var current_tab_url = null;
    getCurrentTabUrl(function(url) {
        current_tab_url = url
        console.log("start: getCurrentTabUrl.Callback: got current url "
        + current_tab_url);
        urlManager.tab = current_tab_url;
        urlManager.storeUrl();
    });

}

document.addEventListener('DOMContentLoaded', function() {
    initBlockingStatus();
    var btnAdd = document.getElementById('btnAdd');
    btnAdd.addEventListener('click', start);

    var btnRemove = document.getElementById('btnRemove');
    btnRemove.addEventListener('click', removeCurrentUrl);

    var btnManage = document.getElementById('btnManage');
    btnManage.addEventListener('click', clearStorage);

    var btnControl = document.getElementById('btnControl');
    btnControl.addEventListener('click', controlBlocking);
});
