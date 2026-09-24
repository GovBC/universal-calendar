import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const icon = readFileSync(join(root, 'dist/icon.svg'), 'utf8');
const foreground = readFileSync(join(root, 'native/icon-foreground.svg'), 'utf8');
const insideIcon = icon.replace(/^.*?<svg[^>]*>/s, '').replace(/<\/svg>\s*$/s, '');
const render = (svg, size) => new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
const write = (file, svg, size) => writeFileSync(join(root, file), render(svg, size));

const solidIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#0c1928"/>${insideIcon}</svg>`;
await sharp(render(solidIcon, 1024)).removeAlpha().png().toFile(join(root, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'));
for (const [density, size] of Object.entries({ mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 })) {
  const dir = `android/app/src/main/res/mipmap-${density}`;
  write(`${dir}/ic_launcher.png`, icon, size);
  write(`${dir}/ic_launcher_round.png`, icon, size);
  write(`${dir}/ic_launcher_foreground.png`, foreground, size);
}
function splash(width, height, iconSize) {
  const left = (width - iconSize) / 2, top = (height - iconSize) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#0c1928"/>
    <g transform="translate(${left} ${top}) scale(${iconSize / 512})">${insideIcon}</g>
  </svg>`;
}
const iosSplash = join(root, 'ios/App/App/Assets.xcassets/Splash.imageset');
for (const filename of readdirSync(iosSplash).filter(file => file.endsWith('.png'))) {
  writeFileSync(join(iosSplash, filename), render(splash(2732, 2732, 460), 2732));
}
const res = join(root, 'android/app/src/main/res');
for (const folder of readdirSync(res).filter(name => name.startsWith('drawable'))) {
  const file = join(res, folder, 'splash.png');
  let png;
  try { png = readFileSync(file); } catch { continue; }
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  const iconSize = Math.min(160, Math.round(Math.min(width, height) * 0.35));
  writeFileSync(file, render(splash(width, height, iconSize), width));
}
console.log('Updated iOS and Android icons and launch images from dist/icon.svg');
