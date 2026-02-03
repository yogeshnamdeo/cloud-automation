import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Read Order IDs from TXT (Safe + Portable)
async function readOrderIdsFromTXT(filePath) {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`❌ Orders file not found: ${resolvedPath}`);
  }

  const content = fs.readFileSync(resolvedPath, 'utf-8');
  return content.split('\n').map(line => line.trim()).filter(Boolean);
}

test('Search Order IDs from TXT and verify results', async ({ page }) => {

  const passedOrders = [];
  const failedOrders = [];

  // ✅ Fixed path (safe for Windows)
  const orderFilePath = 'D:/PlacedOrderIDs/orders.txt';
  const orderIds = await readOrderIdsFromTXT(orderFilePath);

  await page.goto('https://dev.coms.momentecbrands.com/login');

  await page.getByRole('textbox', { name: 'Username' }).fill('COMS_MANUAL_QA');
  await page.getByRole('textbox', { name: 'Password' }).fill('It$Th#b3$t2024');

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: 'Login', exact: true }).click()
  ]);

  await page.locator('#multiselectelement span').first().click();
  await page.getByRole('option', { name: 'Web Order #' }).click();

  const searchBox = page.getByRole('textbox', { name: 'Select' });

  // Screenshot folder
  const screenshotDir = 'D:/PlaywrightReports/screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  for (const orderId of orderIds) {

    await searchBox.click();
    await searchBox.press('Control+A');
    await searchBox.press('Backspace');
    await searchBox.fill(orderId);

    await page.getByLabel('Search').click();

    try {
      await expect(page.getByText(orderId)).toBeVisible({ timeout: 5000 });
      passedOrders.push(orderId);
    } catch {
      const screenshotPath = `${screenshotDir}/${orderId}.png`;

      failedOrders.push({
        orderId,
        screenshot: screenshotPath
      });

      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
    }
  }

  // Generate HTML Report
  function generateHTMLReport(passed, failed) {
    const timestamp = new Date().toLocaleString();

    return `
    <html>
    <head>
      <title>Order Search Report</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        .passed { color: green; }
        .failed { color: red; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background: #eee; }
      </style>
    </head>
    <body>
      <h1>📊 Order Automation Report</h1>
      <p>Generated: ${timestamp}</p>
      <p>Total: ${passed.length + failed.length}</p>
      <p class="passed">Passed: ${passed.length}</p>
      <p class="failed">Failed: ${failed.length}</p>

      <h2>✔ Passed Orders</h2>
      <ul>${passed.map(id => `<li>${id}</li>`).join('')}</ul>

      <h2>❌ Failed Orders</h2>
      <ul>${failed.map(item => `<li>${item.orderId}</li>`).join('')}</ul>
    </body>
    </html>`;
  }

  const reportHTML = generateHTMLReport(passedOrders, failedOrders);

  const reportDir = 'D:/PlaywrightReports';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = `${reportDir}/order-report.html`;
  fs.writeFileSync(reportPath, reportHTML);

  console.log(`📄 Report saved at: ${reportPath}`);

  // ===============================
  // EMAIL REPORT SECTION
  // ===============================

  async function sendEmailReport() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yogesh.namdeo@gmail.com',
        pass: 'nrgllsctrrzvwbqx' // ⚠️ Recommend moving to ENV variable
      }
    });

    const attachments = [
      { filename: 'order-report.html', path: reportPath },
      ...failedOrders.map(item => ({
        filename: `${item.orderId}.png`,
        path: item.screenshot
      }))
    ];

    await transporter.sendMail({
      from: 'yogesh.namdeo@gmail.com',
      to: 'yogesh.n@royalcyber.com',
      subject: 'Playwright Order Automation Report',
      html: `
        <h2>Order Search in COMS Completed</h2>
        <p>Total Orders: ${passedOrders.length + failedOrders.length}</p>
        <p style="color:green;">Passed: ${passedOrders.length}</p>
        <p style="color:red;">Failed: ${failedOrders.length}</p>
        <p>Report & screenshots attached.</p>
      `,
      attachments
    });

    console.log('📧 Email report sent successfully!');
  }

  await sendEmailReport();
});
