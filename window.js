var popupWindow = window.open(
    chrome.extension.getURL("pages/popup.html"),
    "exampleName",
    "width=400,height=400"
);
window.close(); // close the Chrome extension pop-up