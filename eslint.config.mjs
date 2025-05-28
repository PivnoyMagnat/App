// eslint.config.mjs
import globals from "globals";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Браузерные глобалы (window, document)
        chrome: "readonly"  // Добавляем chrome как глобальную переменную
      }
    }
  }
];
