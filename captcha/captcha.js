document.addEventListener("DOMContentLoaded", () => {
  const captchaBox = document.getElementById("captchaBox");
  const captchaInput = document.getElementById("captchaInput");
  const verifyBtn = document.getElementById("verifyBtn");
  const errorMsg = document.getElementById("errorMsg");

  // Generate simple CAPTCHA
  function generateCaptcha() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    captchaBox.textContent = captcha;
    return captcha;
  }

  let currentCaptcha = generateCaptcha();

  verifyBtn.addEventListener("click", () => {
    if (captchaInput.value === currentCaptcha) {
      chrome.runtime.sendMessage({ type: "captchaVerified" });
      window.close();
    } else {
      errorMsg.textContent = "Incorrect CAPTCHA. Please try again.";
      currentCaptcha = generateCaptcha();
      captchaInput.value = "";
    }
  });
});
