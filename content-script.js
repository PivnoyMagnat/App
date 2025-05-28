// Monitor for download attempts and notify background
document.addEventListener('click', (e) => {
  let target = e.target;
  while (target != null) {
    if (target.tagName === 'A' && target.hasAttribute('download')) {
      e.preventDefault();
      chrome.runtime.sendMessage({
        type: "downloadAttempt",
        url: target.href,
        filename: target.getAttribute('download')
      });
      return;
    }
    target = target.parentElement;
  }
}, true);