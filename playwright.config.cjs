const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
	testDir: './tests',
	testMatch: '*.spec.cjs',
	forbidOnly: !!process.env.CI,
	retries: 0,
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'retain-on-failure'
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }
	],
	webServer: {
		command: 'npm start',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: false
	}
});
