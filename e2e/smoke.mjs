// End-to-end smoke test: plays through the first daily session on a phone-
// sized viewport, answering every step (deliberately not always correctly)
// and checks that progress, the streak and reviews come out right.
//
// Usage: npm run build && npx vite preview --port 4173 & npm run e2e
// Needs Playwright: `npm i -D playwright`, or a global install on NODE_PATH.
// Env: BASE_URL (default http://localhost:4173/), SCREENSHOTS=dir to save shots.

import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

// require() so a globally installed Playwright (via NODE_PATH) also works.
const { chromium, devices } = createRequire(import.meta.url)('playwright');

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173/';
const SHOTS = process.env.SCREENSHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['iPhone 13'] });
const page = await context.newPage();
page.setDefaultTimeout(Number(process.env.STEP_TIMEOUT ?? 10000));
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

let shot = 0;
const snap = async (name) => SHOTS && page.screenshot({ path: `${SHOTS}/${String(++shot).padStart(2, '0')}-${name}.png`, fullPage: false });

function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

await page.goto(BASE_URL);
await page.getByText('Your daily session').waitFor();
await snap('home');

// Track screen shows the outline.
await page.getByRole('button', { name: /Strategy/ }).first().click();
await page.getByText('Industry Analysis').waitFor();
await page.getByRole('button', { name: 'Back' }).click();
await page.getByText('Your daily session').waitFor();

await page.getByRole('button', { name: /Start/ }).click();

const seen = new Set();
for (let guard = 0; guard < 60; guard++) {
  if (await page.getByRole('heading', { name: 'Lesson complete' }).isVisible()) break;
  const eyebrow = (await page.locator('.player-body .eyebrow').first().textContent().catch(() => '')) ?? '';
  const prompt = (await page.locator('.player-body').first().innerText()).slice(0, 60);
  if (process.env.DEBUG) console.log(guard, eyebrow, '|', prompt.replace(/\n/g, ' '));

  if (eyebrow.includes('Concept')) {
    if (!seen.has('concept')) await snap('concept');
    seen.add('concept');
    await page.getByRole('button', { name: 'Continue' }).click();
    continue;
  }

  if (eyebrow.includes('Mini case')) {
    await page.locator('.choices .choice').first().click();
    await page.getByRole('button', { name: 'Decide' }).click();
    if (!seen.has('case')) await snap('case');
    seen.add('case');
  } else if (eyebrow.includes('Match')) {
    // Brute force pairs; mismatches count as a miss but the step still completes.
    const col = (i) => page.locator('.match-col').nth(i).locator('.match-item');
    const lefts = await col(0).allInnerTexts();
    for (const l of lefts) {
      const rights = await page.locator('.match-col').nth(1).locator('.match-item:not(.is-matched)').allInnerTexts();
      for (const r of rights) {
        const leftBtn = col(0).filter({ hasText: l });
        await leftBtn.click();
        await col(1).filter({ hasText: r }).click();
        await page.waitForTimeout(400);
        if (await leftBtn.evaluate((el) => el.classList.contains('is-matched'))) break;
      }
    }
  } else if (eyebrow.includes('Put in order')) {
    const pool = page.locator('.order-pool .order-chip');
    while (await pool.count()) await pool.first().click();
    await page.getByRole('button', { name: 'Check' }).click();
  } else if (eyebrow.includes('Quick calculation')) {
    await page.getByRole('textbox').fill('40');
    if (!seen.has('numeric')) await snap('numeric');
    seen.add('numeric');
    await page.getByRole('button', { name: 'Check' }).click();
  } else if (eyebrow.includes('True or false')) {
    await page.getByRole('button', { name: 'False' }).click();
    await page.getByRole('button', { name: 'Check' }).click();
  } else {
    await page.locator('.choices .choice').first().click();
    await page.getByRole('button', { name: 'Check' }).click();
  }

  await page.getByRole('button', { name: 'Continue' }).waitFor();
  if (!seen.has('feedback') && (await page.locator('.feedback').count())) {
    await snap('feedback');
    seen.add('feedback');
  }
  await page.getByRole('button', { name: 'Continue' }).click();
  assert(guard < 59, `session did not finish (stuck at: ${prompt})`);
}

await page.getByRole('heading', { name: 'Lesson complete' }).waitFor();
await snap('complete');
await page.getByRole('button', { name: 'Done' }).click();
await page.getByText('Keep going?').waitFor();

const state = await page.evaluate(() => JSON.parse(localStorage.getItem('mba-otg:state')));
assert(state.lessons['fa-1-1']?.completions === 1, 'first lesson recorded');
assert(state.streak.current === 1, 'streak started');
assert(Object.keys(state.cards).length >= 9, 'exercises and key terms scheduled for review');
assert(await page.getByText('The balance sheet').first().isVisible(), 'next lesson offered');
await snap('home-after');

// Progress survives a reload.
await page.reload();
await page.getByText('Keep going?').waitFor();

await page.getByRole('button', { name: 'Settings' }).click();
await page.getByText('Download backup').waitFor();
await snap('settings');

assert(errors.length === 0, `no console errors (got: ${errors.join(' | ')})`);
await browser.close();
console.log('Smoke test passed');
