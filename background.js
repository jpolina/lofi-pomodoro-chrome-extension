chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
        url: chrome.runtime.getURL("/pages/index.html"),
        type:"popup",
        width:400,
        height:500
    });
});