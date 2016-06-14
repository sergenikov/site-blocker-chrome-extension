// Blocker loads when page you are browsing to loads.

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
            overlay_span.innerHTML = "This page is blocked. Keep working.";
            overlay_div.appendChild(overlay_span);
            // // append to DOM
            document.body.appendChild(overlay_div);

            //alert("blocked page");
            //Creating Elements
            // var el = document.getElementById("top_of_page");
            // console.log("got element class " + el.parentElement.getAttribute("class"));

            // var divNode = document.createElement("div")
            // divNode.setAttribute("id", "sergey");
            // divNode.innerHTML = "skov";
            // console.log("divNode id " + divNode.getAttribute("id"));
            // //Appending to DOM
            // el.appendChild(divNode);
            // document.body.appendChild(divNode);

            // var newDiv = document.createElement("div");
            // newDiv.innerHTML = "hello from new div";
            // newDiv.style.width = "100px";
            // newDiv.style.height = "100px";
            // newDiv.style.background = "red";
            // newDiv.style.color = "white";
            // document.body.appendChild(newDiv);
        }
    }
}

function checkUrl() {
    /* Checked if the hostname is supposed to be blocked. */
    chrome.storage.local.get('blocked', checkUrlCallback);
}

printBlockedUrls();
checkUrl();
