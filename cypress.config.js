const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    projectId: 'h44eba',
    specPattern: [
      'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
      'cypress/e2e/**/*.feature'
    ],
  },
  component: {
    specPattern: 'src/**/*.{cy,spec}.{js,jsx,ts,tsx}',
  }
})