// Renders resources/icon.svg -> iOS AppIcon (1024, no alpha) + dark splash images.
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = path.join(root, 'resources/icon.svg');
const assets = path.join(root, 'ios/App/App/Assets.xcassets');
const store = path.join(root, '../store/AppIcon_1024x1024.png');

const icon = sharp(svg, { density: 300 }).resize(1024, 1024).flatten({ background: '#070e11' }).removeAlpha().png();
await icon.clone().toFile(path.join(assets, 'AppIcon.appiconset/AppIcon-512@2x.png'));
await icon.clone().toFile(store);

const logo = await sharp(svg, { density: 300 }).resize(640, 640).png().toBuffer();
for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
  await sharp({ create: { width: 2732, height: 2732, channels: 3, background: '#070e11' } })
    .composite([{ input: logo, gravity: 'center' }]).png().toFile(path.join(assets, 'Splash.imageset', name));
}
console.log('icons + splash generated');
