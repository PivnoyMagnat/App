document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('captchaToggle');
  
  // Load current state
  chrome.runtime.sendMessage({type: "getCaptchaStatus"}, (response) => {
    toggle.checked = response.enabled;
  });
  
  // Toggle CAPTCHA
  toggle.addEventListener('change', () => {
    chrome.runtime.sendMessage({
      type: "toggleCaptcha",
      enabled: toggle.checked
    });
  });
});