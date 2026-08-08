import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = process.argv[2] || 'C:/Users/aleks/Downloads/app_logo.webp'
const outDir = path.join(__dirname, '..', 'public')

fs.mkdirSync(outDir, { recursive: true })

const { dominant } = await sharp(src).stats()
const theme =
  '#' +
  [dominant.r, dominant.g, dominant.b]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
console.log('theme_color', theme)

await sharp(src).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'))
await sharp(src).resize(192, 192).png().toFile(path.join(outDir, 'pwa-192x192.png'))
await sharp(src).resize(512, 512).png().toFile(path.join(outDir, 'pwa-512x512.png'))
await sharp(src).resize(32, 32).png().toFile(path.join(outDir, 'favicon-32x32.png'))
await sharp(src).webp().toFile(path.join(outDir, 'app_logo.webp'))
console.log('icons written to', outDir)
