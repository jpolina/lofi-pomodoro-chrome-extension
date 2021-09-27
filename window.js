var popupWindow = window.open(
    chrome.extension.getURL("pages/popup.html"),
    '_blank',
    `toolbar=no,
    location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=400,height=400`
);
window.close(); // close the Chrome extension pop-up