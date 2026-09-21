const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'projects');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = [
  // مول الماسة
  { id: 'IMG-3639', url: 'https://i.postimg.cc/9fcmkGxP/IMG-3639.webp' },
  { id: 'IMG-3638', url: 'https://i.postimg.cc/3RRK83Q3/IMG-3638.webp' },
  { id: 'IMG-3637', url: 'https://i.postimg.cc/59DFRR8J/IMG-3637.webp' },
  { id: 'IMG-3635', url: 'https://i.postimg.cc/wjQy3xZy/IMG-3635.webp' },
  
  // معرض كواترو موتورز
  { id: 'IMG-3643', url: 'https://i.postimg.cc/HLSgPFcR/IMG-3643.webp' },
  { id: 'IMG-3641', url: 'https://i.postimg.cc/L4gpNCHz/IMG-3641.webp' },
  { id: 'IMG-3644', url: 'https://i.postimg.cc/nhpfVnqN/IMG-3644.webp' },
  
  // مصحة الحياة الطبية
  { id: 'IMG-3647', url: 'https://i.postimg.cc/SsQncL6M/IMG-3647.webp' },
  { id: 'IMG-3646', url: 'https://i.postimg.cc/dVMD5cRd/IMG-3646.webp' },
  { id: 'IMG-3645', url: 'https://i.postimg.cc/4d33YfGp/IMG-3645.webp' },
  
  // قاعة جمانة للمناسبات
  { id: 'IMG-3650', url: 'https://i.postimg.cc/tCp0Xrz0/IMG-3650.webp' },
  { id: 'IMG-3649', url: 'https://i.postimg.cc/FKtV46jM/IMG-3649.webp' },
  { id: 'IMG-3648', url: 'https://i.postimg.cc/CKysg2Gy/IMG-3648.webp' },
  
  // panyoti cafe
  { id: 'IMG-3634', url: 'https://i.postimg.cc/FFbQMfLW/IMG-3634.webp' },
  { id: 'IMG-3633', url: 'https://i.postimg.cc/Vkhyqn3D/IMG-3633.webp' },
  { id: 'IMG-3632', url: 'https://i.postimg.cc/LsgcNhSY/IMG-3632.webp' },
];

const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function run() {
  const missing = images.filter(img => !fs.existsSync(path.join(targetDir, `${img.id}.webp`)));
  console.log(`Missing images: ${missing.map(m => m.id).join(', ')}`);

  for (const img of missing) {
    let success = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        console.log(`Downloading ${img.id} (Attempt ${attempt})...`);
        const rawBuf = await downloadBuffer(img.url);
        const optimizedBuf = await sharp(rawBuf)
          .resize({ width: 960, height: 720, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 6, smartSubsample: true })
          .toBuffer();

        const outPath = path.join(targetDir, `${img.id}.webp`);
        fs.writeFileSync(outPath, optimizedBuf);
        console.log(`✔ Saved ${img.id}.webp (${(optimizedBuf.length / 1024).toFixed(1)} KB)`);
        success = true;
        break;
      } catch (e) {
        console.warn(`Attempt ${attempt} failed for ${img.id}:`, e.message);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    if (!success) {
      console.error(`FAILED to download ${img.id}`);
    }
  }

  const allFiles = fs.readdirSync(targetDir);
  console.log('All available images in projects:', allFiles.length);
}

run();
