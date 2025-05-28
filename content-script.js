function isCaptchaPresent() {
  return (
    document.querySelector('iframe[src*="recaptcha"]') ||
    document.querySelector('div.h-captcha') ||
    document.querySelector('script[src*="hcaptcha.com"]') ||
    document.querySelector('img[alt*="captcha"]')
  );
}

function isDownloadLink(element) {
  return element?.tagName === 'A' &&
    /\.(zip|rar|exe|pdf|docx?)$/i.test(element.getAttribute('href') || '');
}

// Блокировка кликов по ссылкам
document.addEventListener('click', function (e) {
  const target = e.target.closest('a');
  if (isCaptchaPresent() && isDownloadLink(target)) {
    e.preventDefault();
    alert('Скачивание заблокировано: сначала пройдите капчу.');
  }
}, true);

// Блокировка перенаправления через window.location
const originalAssign = window.location.assign;
window.location.assign = function (url) {
  if (isCaptchaPresent() && /\.(zip|rar|exe|pdf|docx?)$/i.test(url)) {
    alert('Скачивание заблокировано из-за капчи.');
    return;
  }
  originalAssign.call(window.location, url);
};

// Пример автоматического разрешения после исчезновения капчи
const observer = new MutationObserver(() => {
  if (!isCaptchaPresent()) {
    console.log('Капча пройдена. Скачивание разрешено.');
  }
});
observer.observe(document.body, { childList: true, subtree: true });