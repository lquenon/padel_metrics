import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'icon.svg');

// Sizes to generate
const sizes = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-192x192.png', size: 192, maskable: true },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon.ico', size: 32, maskable: false }
];

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  try {
    // Read the SVG
    const svgBuffer = fs.readFileSync(svgPath);

    for (const { name, size, maskable } of sizes) {
      const outputPath = path.join(publicDir, name);

      let image = sharp(svgBuffer).resize(size, size);

      // For maskable icons, add padding (safe area)
      if (maskable) {
        const paddedSize = Math.floor(size * 1.2);
        image = sharp(svgBuffer)
          .resize(size, size)
          .extend({
            top: Math.floor((paddedSize - size) / 2),
            bottom: Math.floor((paddedSize - size) / 2),
            left: Math.floor((paddedSize - size) / 2),
            right: Math.floor((paddedSize - size) / 2),
            background: { r: 26, g: 16, b: 34, alpha: 1 }
          })
          .resize(size, size);
      }

      await image.png().toFile(outputPath);
      console.log(`✓ Generated ${name} (${size}x${size}${maskable ? ' maskable' : ''})`);
    }

    console.log('\n✨ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
