importScripts('popup/libs/otplib-browser.js');
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "verifyTOTP") {
    chrome.storage.local.get("totpSecret", (res) => {
      const valid = otplib.authenticator.check(msg.code, res.totpSecret);
      sendResponse({ valid });
    });
    return true; // async response
  }
});
let downloadQueue = [];
let isCaptchaEnabled = true;

chrome.downloads.onCreated.addListener((downloadItem) => {
  if (isCaptchaEnabled) {
    chrome.downloads.cancel(downloadItem.id);
    downloadQueue.push(downloadItem);
    
    // Open captcha page
    chrome.windows.create({
      url: chrome.runtime.getURL("captcha/captcha.html"),
      type: "popup",
      width: 400,
      height: 500,
      focused: true
    });
  }
});

// Function to process queued downloads after captcha
function processDownloadQueue() {
  downloadQueue.forEach(item => {
    chrome.downloads.download({
      url: item.url,
      filename: item.filename,
      saveAs: item.saveAs
    });
  });
  downloadQueue = [];
}

// Listen for captcha verification
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "captchaVerified") {
    processDownloadQueue();
  }
  
  if (request.type === "toggleCaptcha") {
    isCaptchaEnabled = request.enabled;
    sendResponse({status: "success"});
  }
});