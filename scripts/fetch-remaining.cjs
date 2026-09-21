const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'projects');

const remaining = [
  { id: 'IMG-3646', url: 'https://i.postimg.cc/dVMD5cRd/IMG-3646.webp' },
  { id: 'IMG-3645', url: 'https://i.postimg.cc/4d33YfGp/IMG-3645.webp' },
  { id: 'IMG-3633', url: 'https://i.postimg.cc/Vkhyqn3D/IMG-3633.webp' },
  { id: 'IMG-3632', url: 'https://i.postimg.cc/LsgcNhSY/IMG-3632.webp' },
];

async function run() {
  for (const item of remaining) {
    const tmpPath = path.join(targetDir, `${item.id}.raw.webp`);
    const outPath = path.join(targetDir, `${item.id}.webp`);
    console.log(`Downloading ${item.id}...`);
    execSync(`curl.exe -k --ssl-no-revoke -s -A "Mozilla/5.0" -o "${tmpPath}" "${item.url}"`);
    if (fs.existsSync(tmpPath)) {
      const rawBuf = fs.readFileSync(tmpPath);
      const optBuf = await sharp(rawBuf)
        .resize({ width: 960, height: 720, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 6, smartSubsample: true })
        .toBuffer();
      fs.writeFileSync(outPath, optBuf);
      fs.unlinkSync(tmpPath);
      console.log(`✔ Optimized ${item.id}: ${(rawBuf.length / 1024).toFixed(1)} KB -> ${(optBuf.length / 1024).toFixed(1)} KB`);
    }
  }

  const all = fs.readdirSync(targetDir);
  console.log('All images in public/images/projects:');
  all.forEach(f => {
    const stat = fs.statSync(path.join(targetDir, f));
    console.log(` - ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
  });
}

run();
