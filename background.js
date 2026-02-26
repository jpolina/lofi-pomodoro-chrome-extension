chrome.action.onClicked.addListener(()=> {
    chrome.windows.create({
        url: chrome.runtime.getURL("/pages/index.html"),
        type:"popup",
        width:430,
        height:430
    });
});
