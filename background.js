chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
    url: chrome.runtime.getURL("/pages/index.html"),
    type:"popup",
    width:420,
    height:500
    });
});