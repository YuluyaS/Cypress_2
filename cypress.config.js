// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Настройка путей для e2e тестов
    specPattern: [
      'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
      'cypress/e2e/**/*.feature' // если используете BDD
    ],
    // Другие настройки e2e...
  },
  component: {
    // Настройка путей для компонентных тестов
    specPattern: 'src/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    // Другие настройки компонентов...
  }
})