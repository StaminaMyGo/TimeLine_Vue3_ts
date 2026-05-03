const { test, expect } = require('@playwright/test');

test('check page', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    console.log('CONSOLE [' + msg.type() + ']: ' + msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGEERROR: ' + err.message);
    errors.push(err.message);
  });
  await page.goto('http://localhost:5175/');
  await page.waitForTimeout(3000);
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('BODY HTML:', html.substring(0, 3000));
  console.log('ERRORS:', JSON.stringify(errors));
});
