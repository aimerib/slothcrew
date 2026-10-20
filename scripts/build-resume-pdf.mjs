// Prints /resume/ from the built site (_site) to resume/aimeri-baddouh-resume.pdf.
//
//   npm run resume:pdf
//
// Needs a Chromium that playwright-core can drive. If the bundled one is
// missing, run `npx playwright-core install chromium` once, or point
// RESUME_CHROME_PATH at a Chrome/Chromium binary. Installed Google Chrome is
// tried automatically as a fallback.

import http from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import resume from '../blog/_data/resume.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = path.join(root, '_site');
const outFile = path.join(root, 'resume', 'aimeri-baddouh-resume.pdf');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf',
};

// Minimal static server for the built site.
const server = http.createServer(async (req, res) => {
  try {
    let file = path.join(siteDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(siteDir)) throw new Error('outside site');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});

async function launch() {
  if (process.env.RESUME_CHROME_PATH) {
    return chromium.launch({ executablePath: process.env.RESUME_CHROME_PATH });
  }
  try {
    return await chromium.launch();
  } catch (bundledError) {
    try {
      return await chromium.launch({ channel: 'chrome' });
    } catch {
      throw new Error(
        'No Chromium found. Run `npx playwright-core install chromium` or set RESUME_CHROME_PATH.\n' +
          bundledError.message,
      );
    }
  }
}

// "fine-tuning (full-parameter, LoRA), SFT" -> ["fine-tuning (full-parameter, LoRA)", "SFT"]
const keywords = resume.skills
  .flatMap(skill => skill.items.split(/,(?![^()]*\))/))
  .map(item => item.trim())
  .filter(Boolean);

await stat(path.join(siteDir, 'resume', 'index.html')).catch(() => {
  throw new Error('_site/resume/index.html is missing. Build the site first (npm run build).');
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await launch();

try {
  const page = await browser.newPage();
  // Keep the render hermetic: the sheet only needs local files.
  await page.route('**/*', route =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort(),
  );
  await page.goto(`${origin}/resume/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const fontsLoaded = await page.evaluate(() =>
    ['400 12px "Resume Sans"', '600 12px "Resume Sans"', '12px "Resume Serif"'].every(font =>
      document.fonts.check(font),
    ),
  );
  if (!fontsLoaded) throw new Error('Resume fonts did not load; refusing to print with fallback fonts.');

  const printed = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
    outline: true,
  });

  const pdf = await PDFDocument.load(printed, { updateMetadata: false });
  pdf.setTitle(`${resume.name} — Resume`, { showInWindowTitleBar: true });
  pdf.setAuthor(resume.name);
  pdf.setSubject(resume.headline);
  pdf.setKeywords([keywords.join(', ')]);
  pdf.setCreator('baddouh.com/resume');
  pdf.setLanguage('en-US');
  const bytes = await pdf.save({ useObjectStreams: false });
  await writeFile(outFile, bytes);
  // Refresh the built copy too, so a local preview serves the new PDF.
  await writeFile(path.join(siteDir, 'resume', path.basename(outFile)), bytes);

  const pages = pdf.getPageCount();
  console.log(`Wrote ${path.relative(root, outFile)} (${pages} page${pages === 1 ? '' : 's'})`);
  if (pages > 2) console.warn('Warning: more than two pages; consider trimming.');
} finally {
  await browser.close();
  server.close();
}
