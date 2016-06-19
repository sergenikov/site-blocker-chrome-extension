// Blocker loads when page you are browsing to loads.

var constants = {
    blockedMessage : "This domain is blocked during work hours. Keep working."
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
    /* Used by checkUrl. Blocks current page. */
    var blocked = result.blocked;
    for (i in blocked) {
        if (location.hostname === blocked[i]) {
            console.log("[WARNING] " + location.hostname
                    + " is blocked. Replacing page.");

            // create overlay elements
            var overlay_div = document.createElement("div");
            overlay_div.setAttribute("id", "overlay-div");
            var overlay_span = document.createElement("span");
            overlay_span.setAttribute("id", "overlay-span");
            overlay_span.innerHTML = constants.blockedMessage;
            overlay_div.appendChild(overlay_span);
            document.body.appendChild(overlay_div);
        }
    }
}

function checkUrl() {
    /* Checked if the hostname is supposed to be blocked. */
    chrome.storage.local.get('blocked', checkUrlCallback);
}

printBlockedUrls();
checkUrl();
