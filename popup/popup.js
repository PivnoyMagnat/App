const captchaToggle = document.getElementById("captchaToggle");
const authToggle = document.getElementById("authToggle");
const qrSection = document.getElementById("qrSection");
const qrCanvas = document.getElementById("qrCanvas");
const resetBtn = document.getElementById("resetBtn");

const SECRET_KEY = "totpSecret";

captchaToggle.addEventListener("change", () => {
  chrome.storage.local.set({ useCaptcha: captchaToggle.checked });
});

authToggle.addEventListener("change", () => {
  chrome.storage.local.set({ useAuthenticator: authToggle.checked }, () => {
    if (authToggle.checked) {
      setupAuthenticator();
    } else {
      qrSection.style.display = "none";
    }
  });
});

resetBtn.addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    captchaToggle.checked = false;
    authToggle.checked = false;
    qrSection.style.display = "none";
    alert("Настройки сброшены.");
  });
});

function setupAuthenticator() {
  chrome.storage.local.get([SECRET_KEY], (res) => {
    let secret = res[SECRET_KEY];
    if (!secret) {
      secret = otplib.authenticator.generateSecret(); 
      chrome.storage.local.set({ [SECRET_KEY]: secret });
    }
    const uri = otplib.authenticator.keyuri("User", "FileAuthExtension", secret);
    QRCode.toCanvas(qrCanvas, uri, (err) => {
      if (!err) {
        qrSection.style.display = "block";
      }
    });
  });
}

chrome.storage.local.get(["useCaptcha", "useAuthenticator"], (res) => {
  captchaToggle.checked = res.useCaptcha || false;
  authToggle.checked = res.useAuthenticator || false;
  if (res.useAuthenticator) setupAuthenticator();
});