import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function compressFolder(folderPath, quality = 75) {
  if (!fs.existsSync(folderPath)) return;
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  console.log(`Compressing ${files.length} images in ${folderPath}...`);

  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    totalOriginal += stat.size;

    const buffer = await fs.promises.readFile(filePath);
    // Compress JPEG in-place to 75% quality with progressive loading and mozjpeg optimization
    const compressedBuffer = await sharp(buffer)
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();

    await fs.promises.writeFile(filePath, compressedBuffer);
    totalCompressed += compressedBuffer.length;
  }

  const saved = ((totalOriginal - totalCompressed) / (1024 * 1024)).toFixed(2);
  const percent = (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(1);
  console.log(`Done! Saved ${saved} MB (${percent}% reduction) in ${folderPath}`);
}

async function run() {
  console.log('Starting image compression...');
  await compressFolder(path.resolve('public/hero-sequence'), 70);
  await compressFolder(path.resolve('public/wires-anim'), 70);
  console.log('All image compression complete!');
}

run().catch(console.error);
