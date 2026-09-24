(() => {
  'use strict';
  const key = 'calendar.fontSize';
  const root = document.documentElement;
  const normalize = value => {
    const number = Number(value);
    return Number.isFinite(number) && number >= 100 && number <= 200
      ? Math.round(number / 25) * 25 : 100;
  };
  let size = 100;
  try { size = normalize(localStorage.getItem(key)); } catch (_) {}
  function apply() {
    root.style.fontSize = `${size}%`;
    root.dataset.readingSize = String(size);
  }
  // Apply before the first paint, including when opening another page offline.
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    const get = id => document.getElementById(id);
    const dialog = get('fontSizeDialog');
    const range = get('fontSizeRange');
    const label = () => `${size.toLocaleString('ar-SA')}٪`;
    function sync() {
      range.value = String(size);
      range.setAttribute('aria-valuetext', label());
      get('fontSizeValue').textContent = label();
      get('decreaseFontSize').disabled = size === 100;
      get('increaseFontSize').disabled = size === 200;
    }
    function change(value) {
      size = normalize(value);
      apply();
      sync();
      try {
        localStorage.setItem(key, String(size));
        get('fontSizeSaved').textContent = 'حُفظ حجم الخط على هذا الجهاز.';
      } catch (_) {
        get('fontSizeSaved').textContent = 'طُبّق الحجم لهذه الجلسة؛ تعذّر حفظه على الجهاز.';
      }
      window.dispatchEvent(new Event('resize'));
    }
    get('fontSizeButton').addEventListener('click', () => {
      sync();
      dialog.showModal();
      range.focus();
    });
    get('closeFontSize').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    range.addEventListener('input', () => change(range.value));
    get('decreaseFontSize').addEventListener('click', () => change(size - 25));
    get('increaseFontSize').addEventListener('click', () => change(size + 25));
    get('resetFontSize').addEventListener('click', () => change(100));
    window.addEventListener('storage', event => {
      if (event.key === key || event.key === null) {
        size = normalize(event.newValue);
        apply();
        sync();
        window.dispatchEvent(new Event('resize'));
      }
    });
    sync();
  });
})();
