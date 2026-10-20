// App Store screenshot generator via Chrome DevTools Protocol (no extra deps).
// Usage: node scripts/screenshots.mjs [baseUrl]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(root, '../store/screenshots');
const BASE = process.argv[2] || 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const devices = [
  { name: 'iphone_6.9_1290x2796', width: 430, height: 932, scale: 3, mobile: true },
  { name: 'iphone_6.5_1284x2778', width: 428, height: 926, scale: 3, mobile: true },
  { name: 'ipad_13_2048x2732', width: 1024, height: 1366, scale: 2, mobile: true },
];

const port = 9333;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'husu-shot-'));
const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, '--headless=new', `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0; const pending = new Map();
function send(method, params = {}) { const msgId = ++id; ws.send(JSON.stringify({ id: msgId, method, params })); return new Promise((res, rej) => pending.set(msgId, { res, rej })); }
async function evaluate(expr) { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.value; }
async function waitFor(expr, timeout = 20000) { const t = Date.now(); while (Date.now() - t < timeout) { if (await evaluate(expr)) return true; await sleep(200); } throw new Error('timeout: ' + expr); }
async function shot(dir, name) { await sleep(700); const { data } = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(dir, name), Buffer.from(data, 'base64')); console.log('  ', name); }
async function go(url) { await send('Page.navigate', { url }); await sleep(400); await waitFor('document.readyState==="complete"'); await sleep(600); }

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch { await sleep(200); } }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)[m.error ? 'rej' : 'res'](m.error || m.result); pending.delete(m.id); } });
  await send('Page.enable'); await send('Runtime.enable');

  for (const d of devices) {
    const dir = path.join(outRoot, d.name); fs.mkdirSync(dir, { recursive: true });
    console.log(d.name);
    await send('Emulation.setDeviceMetricsOverride', { width: d.width, height: d.height, deviceScaleFactor: d.scale, mobile: d.mobile });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });

    // Dark theme
    await go(BASE + '/'); await evaluate(`localStorage.clear();localStorage.setItem('husu:v1:theme','"dark"');localStorage.setItem('husu:v1:fontSize','"large"');true`);
    await go(BASE + '/'); await shot(dir, '01_ana_sayfa_gunun_ayeti.png');

    await go(BASE + '/oku'); await waitFor(`document.querySelectorAll('.verse-card').length>2`);
    await shot(dir, '02_fatiha_okuma.png');

    await evaluate(`(()=>{const b=document.querySelectorAll('.verse-card')[1].querySelectorAll('.arabic-token');b[b.length>1?1:0].click();return true})()`);
    await waitFor(`!!document.querySelector('.meaning-panel')`);
    await evaluate(`document.querySelectorAll('.verse-card')[1].scrollIntoView({block:'start'});window.scrollBy(0,-90);true`);
    await shot(dir, '03_kelime_anlami.png');

    await evaluate(`window.scrollTo(0,0);document.querySelector('.primary-selector').click();true`);
    await waitFor(`document.querySelector('dialog')?.open`);
    await evaluate(`document.activeElement?.blur();true`);
    await shot(dir, '04_sure_dua_secimi.png');

    // Light theme: a prayer (dua) with word meaning
    await evaluate(`localStorage.setItem('husu:v1:theme','"light"');true`);
    await go(BASE + '/oku'); await waitFor(`document.querySelectorAll('.verse-card').length>0`);
    await evaluate(`document.querySelector('.primary-selector').click();true`);
    await waitFor(`document.querySelector('dialog')?.open`);
    await evaluate(`(()=>{const s=document.querySelector('.picker-filter select');const set=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;set.call(s,'prayers');s.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
    await sleep(400);
    await evaluate(`document.querySelector('.surah-option')?.click();true`);
    await waitFor(`!document.querySelector('dialog')?.open && document.querySelectorAll('.verse-card').length>0`);
    await evaluate(`(()=>{const b=document.querySelector('.verse-card .arabic-token');b&&b.click();window.scrollTo(0,0);return true})()`);
    await shot(dir, '05_namaz_duasi_acik_tema.png');

    await evaluate(`document.querySelector('.latin-button')?.click();true`);
    await evaluate(`localStorage.setItem('husu:v1:fontSize','"xlarge"');true`);
    await go(BASE + '/'); await shot(dir, '06_acik_tema_ana_sayfa.png');
  }
} catch (e) { console.error(e); process.exitCode = 1; }
finally { try { ws?.close(); } catch {} chrome.kill(); }
