// backend/auth-service/tests/e2e/loginFlow.test.js
const puppeteer = require('puppeteer');
const { startServer, stopServer } = require('../../src/server');

describe('Login Flow End-to-End Tests', () => {
    let server;
    let browser;
    let page;

    beforeAll(async () => {
        // Start test server
        server = await startServer();

        // Launch browser
        browser = await puppeteer.launch({
            headless: true
        });
    });

    afterAll(async () => {
        // Close browser
        await browser.close();

        // Stop test server
        await stopServer();
    });

    beforeEach(async () => {
        // Create a new page for each test
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('should successfully login with valid credentials', async () => {
        // Navigate to login page
        await page.goto('http://localhost:3000/login');

        // Fill in login form
        await page.type('#email', 'test@example.com');
        await page.type('#password', 'ValidPassword123!');

        // Click login button
        await page.click('#login-button');

        // Wait for navigation or success message
        await page.waitForSelector('.dashboard');

        // Assert successful login
        const dashboardTitle = await page.$eval('.dashboard-title', el => el.textContent);
        expect(dashboardTitle).toContain('Welcome');
    });

    it('should show error for invalid credentials', async () => {
        // Navigate to login page
        await page.goto('http://localhost:3000/login');

        // Fill in incorrect login credentials
        await page.type('#email', 'invalid@example.com');
        await page.type('#password', 'WrongPassword');

        // Click login button
        await page.click('#login-button');

        // Wait for error message
        await page.waitForSelector('.error-message');

        // Assert error message
        const errorMessage = await page.$eval('.error-message', el => el.textContent);
        expect(errorMessage).toContain('Invalid credentials');
    });

    it('should handle password reset flow', async () => {
        // Navigate to login page
        await page.goto('http://localhost:3000/login');

        // Click on forgot password link
        await page.click('#forgot-password-link');

        // Wait for password reset form
        await page.waitForSelector('#reset-password-form');

        // Fill in email
        await page.type('#reset-email', 'test@example.com');

        // Submit reset request
        await page.click('#send-reset-link');

        // Wait for success message
        await page.waitForSelector('.reset-success-message');

        // Assert success message
        const successMessage = await page.$eval('.reset-success-message', el => el.textContent);
        expect(successMessage).toContain('Password reset link sent');
    });
});