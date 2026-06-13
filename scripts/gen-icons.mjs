// Generates GenFit OnSite PWA icons from an inline SVG (no remote images,
// no font dependency — the "G" is drawn as vector shapes). Run with sharp:
//   npm install sharp --no-save && node scripts/gen-icons.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/icons')
mkdirSync(OUT, { recursive: true })

const BG = '#0c0c0d'      // app background
const ACCENT = '#c6ff2e'  // volt accent

// size = viewBox, rx = bg corner radius, r = ring radius (controls padding)
function svg({ rx = 0, r = 150, sw = 52 } = {}) {
  const cx = 256, cy = 256
  const deg = (d) => (d * Math.PI) / 180
  const px = (a) => (cx + r * Math.cos(deg(a))).toFixed(1)
  const py = (a) => (cy + r * Math.sin(deg(a))).toFixed(1)
  // open ring with a gap on the right (the "G" mouth)
  const arc = `M ${px(35)} ${py(35)} A ${r} ${r} 0 1 1 ${px(-35)} ${py(-35)}`
  // crossbar from centre to the right (the "G" tongue)
  const barW = r * 0.92, barH = sw, barX = cx - r * 0.04, barY = cy - barH / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rx}" fill="${BG}"/>
  <path d="${arc}" fill="none" stroke="${ACCENT}" stroke-width="${sw}" stroke-linecap="round"/>
  <rect x="${barX.toFixed(1)}" y="${barY.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH}" rx="${(barH / 2).toFixed(1)}" fill="${ACCENT}"/>
</svg>`
}

const jobs = [
  { file: 'icon-192.png', size: 192, opts: { rx: 96, r: 150, sw: 52 } },
  { file: 'icon-512.png', size: 512, opts: { rx: 112, r: 150, sw: 52 } },
  { file: 'icon-512-maskable.png', size: 512, opts: { rx: 0, r: 120, sw: 46 } }, // extra safe-zone padding
  { file: 'apple-touch-icon-180.png', size: 180, opts: { rx: 0, r: 150, sw: 52 } }, // iOS rounds corners itself
]

for (const j of jobs) {
  await sharp(Buffer.from(svg(j.opts)))
    .resize(j.size, j.size)
    .png()
    .toFile(resolve(OUT, j.file))
  console.log('wrote', j.file)
}
