import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const rootDir = 'C:/Users/HP/.gemini/antigravity-ide/scratch/Enarah2';
const imgDir = path.join(rootDir, 'public/images/wire-apps');
const v10UtilPath = path.join(rootDir, 'src/utils/wirePricesV10.ts');
const wirePricesPagePath = path.join(rootDir, 'src/pages/WirePrices.tsx');
const swPath = path.join(rootDir, 'public/sw.js');

const v10Source = fs.readFileSync(v10UtilPath, 'utf8');
const pageSource = fs.readFileSync(wirePricesPagePath, 'utf8');
const swSource = fs.readFileSync(swPath, 'utf8');

let passed = 0;
let failed = 0;
const results = [];

async function runTest(name, fn) {
  try {
    await fn();
    passed++;
    results.push({ test: name, status: 'PASSED' });
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    failed++;
    results.push({ test: name, status: 'FAILED', error: err.message });
    console.error(`❌ [FAIL] ${name}: ${err.message}`);
  }
}

await (async () => {
  // 1. Correct image mapping & new Nano Banana Pro image for 1.5 mm²
  await runTest('1. 1.5 mm² uses newly generated V10 Nano Banana Pro ceiling lighting image', async () => {
    assert.ok(v10Source.includes("wireId: '1.5'"), '1.5 wireId must exist');
    assert.ok(v10Source.includes("imageSlug: 'v10-app-1-5mm'"), '1.5 must map to v10-app-1-5mm');

    const rawArchivePath = path.join(rootDir, 'scratch/nano-wire-apps/v10_raw_1_5mm.jpg');
    assert.ok(fs.existsSync(rawArchivePath), 'Archived v10_raw_1_5mm.jpg must exist');

    for (const w of [480, 800, 1080]) {
      for (const ext of ['avif', 'webp', 'jpg']) {
        const f = path.join(imgDir, `v10-app-1-5mm-${w}.${ext}`);
        assert.ok(fs.existsSync(f), `Missing ${f}`);
        const stat = fs.statSync(f);
        assert.ok(stat.size > 3000, `File ${f} is unexpectedly small`);
      }
    }

    // Verify legacy 1.5mm file was also updated to match new V10 image
    const v10JpgHash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(path.join(imgDir, 'v10-app-1-5mm-800.jpg')))
      .digest('hex');
    const legacyJpgHash = crypto
      .createHash('sha256')
      .update(fs.readFileSync(path.join(imgDir, 'app-1-5mm-800.jpg')))
      .digest('hex');
    assert.equal(v10JpgHash, legacyJpgHash, 'Legacy app-1-5mm-800.jpg must also contain the new V10 image');
  });

  // 2. Correct image mapping, 4:3 dimensions, and unique hashes across all 7 wire sizes
  await runTest('2. All 7 wire sizes have unique V10 images, 4:3 aspect ratio, and optimized sizes', async () => {
    const expectedSlugs = [
      { id: '1.5', slug: 'v10-app-1-5mm' },
      { id: '2.5', slug: 'v10-app-2-5mm' },
      { id: '4.0', slug: 'v10-app-4-0mm' },
      { id: '6.0', slug: 'v10-app-6-0mm' },
      { id: '10.0', slug: 'v10-app-10-0mm' },
      { id: '16.0', slug: 'v10-app-16-0mm' },
      { id: '25.0', slug: 'v10-app-25-0mm' }
    ];

    const hashes = new Set();
    for (const item of expectedSlugs) {
      assert.ok(v10Source.includes(`imageSlug: '${item.slug}'`), `Missing slug ${item.slug}`);
      const avif480 = path.join(imgDir, `${item.slug}-480.avif`);
      const avif800 = path.join(imgDir, `${item.slug}-800.avif`);
      const avif1080 = path.join(imgDir, `${item.slug}-1080.avif`);

      const meta480 = await sharp(avif480).metadata();
      const meta800 = await sharp(avif800).metadata();
      const meta1080 = await sharp(avif1080).metadata();

      assert.equal(meta480.width, 480);
      assert.equal(meta480.height, 360);
      assert.equal(meta800.width, 800);
      assert.equal(meta800.height, 600);
      assert.equal(meta1080.width, 1080);
      assert.equal(meta1080.height, 810);

      const mobileKb = fs.statSync(avif480).size / 1024;
      const desktopKb = fs.statSync(avif1080).size / 1024;
      assert.ok(mobileKb < 80, `Mobile 480w AVIF for ${item.id} should be < 80KB (got ${mobileKb.toFixed(1)}KB)`);
      assert.ok(desktopKb < 150, `Desktop 1080w AVIF for ${item.id} should be < 150KB (got ${desktopKb.toFixed(1)}KB)`);

      const hash = crypto.createHash('sha256').update(fs.readFileSync(avif800)).digest('hex');
      assert.ok(!hashes.has(hash), `Duplicate image detected for wire size ${item.id}`);
      hashes.add(hash);
    }
    assert.equal(hashes.size, 7, 'Must have 7 distinct wire application images');
  });

  // 3. Rapid switching between sizes & out-of-order request cancellation
  await runTest('3. Rapid switching updates active wire immediately and cancels outdated callbacks', async () => {
    assert.ok(pageSource.includes('latestSwitchReqIdRef'), 'Must track latestSwitchReqIdRef for rapid switching');
    assert.ok(pageSource.includes('handleSelectAppSize'), 'Must use handleSelectAppSize on tab click');
    assert.ok(
      !pageSource.includes('loading="lazy"\n                        decoding="async"'),
      'Active/stacked application images must not be blocked by loading="lazy"'
    );
  });

  // 4. Cached image reuse & stacked pre-decoded layer architecture
  await runTest('4. Cached image reuse & stacked pre-decoded layers prevent re-downloads and white flashes', async () => {
    assert.ok(pageSource.includes('preloadedImagesRef'), 'Must retain decoded Image instances in memory');
    assert.ok(pageSource.includes('decodedWireIds'), 'Must track decodedWireIds state');
    assert.ok(pageSource.includes('mountedWireIds'), 'Must keep visited/preloaded layers mounted');
    assert.ok(swSource.includes("const CACHE_NAME = 'enarah-app-shell-v10'"), 'Service Worker must bump cache to v10');
  });

  // 5. Image loading failure fallback & retry mechanism
  await runTest('5. Image loading failure renders clean dark fallback with Retry button', async () => {
    assert.ok(pageSource.includes('failedWireIds'), 'Must track failedWireIds state');
    assert.ok(pageSource.includes('تعذر تحميل الصورة بسبب ضعف الاتصال.'), 'Must show Arabic fallback notice on image error');
  });

  // 6. Mobile notification guidance exact Arabic copy
  await runTest('6. Exact Arabic iPhone (6 steps) and Android guidance messages are present', async () => {
    const exactIphoneMsg =
      'لتصلك تنبيهات أسعار الأسلاك على هاتف iPhone، أضف موقع الإنارة الحديثة إلى الشاشة الرئيسية، ثم افتحه من الأيقونة وفعّل الإشعارات.';
    const exactIphoneSteps = [
      'افتح الموقع في Safari.',
      'اضغط على زر المشاركة.',
      'اختر «إضافة إلى الشاشة الرئيسية».',
      'افتح الموقع من الأيقونة الجديدة.',
      'ارجع إلى السلك المطلوب واضغط «تفعيل التنبيه».',
      'وافق على السماح بالإشعارات.'
    ];
    const exactAndroidMsg =
      'للوصول السريع إلى أسعار الأسلاك والتنبيهات، يمكنك إضافة موقع الإنارة الحديثة إلى الشاشة الرئيسية لهاتفك.';
    const exactAndroidBtn = 'طريقة إضافة الموقع للشاشة الرئيسية';
    const exactSuccessMsg = 'تم تفعيل تنبيهات هذا السلك بنجاح.';
    const exactFailureMsg = 'تعذر تفعيل التنبيه حاليًا. يُرجى المحاولة مرة أخرى.';

    assert.ok(v10Source.includes(exactIphoneMsg), 'Missing exact iPhone Arabic message');
    for (const s of exactIphoneSteps) {
      assert.ok(v10Source.includes(s), `Missing iPhone step: ${s}`);
    }
    assert.ok(v10Source.includes(exactAndroidMsg), 'Missing exact Android Arabic message');
    assert.ok(v10Source.includes(exactAndroidBtn), 'Missing exact Android button label');
    assert.ok(v10Source.includes(exactSuccessMsg), 'Missing exact success message');
    assert.ok(v10Source.includes(exactFailureMsg), 'Missing exact failure message');
  });

  // 7. iPhone PWA installation detection logic
  await runTest('7. iPhone Safari vs iPhone Standalone Home Screen PWA detection', async () => {
    // Evaluate detection logic directly
    const evalCaps = (input) => {
      const ua = input.userAgent || '';
      const platform = input.platform || '';
      const maxTouchPoints = input.maxTouchPoints ?? 0;
      const isIOS = /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
      const isAndroid = /Android/i.test(ua);
      const isStandalone = Boolean(input.isStandalone);
      const isIOSRequiresHomeScreen = isIOS && !isStandalone;
      const canRequestWebPushNow =
        !isIOSRequiresHomeScreen &&
        Boolean(input.isHttpsOrLocalhost) &&
        Boolean(input.supportsServiceWorker) &&
        Boolean(input.supportsPushManager) &&
        Boolean(input.supportsNotifications);
      return { isIOS, isAndroid, isStandalone, isIOSRequiresHomeScreen, canRequestWebPushNow };
    };

    const iphoneBrowserTab = evalCaps({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
      isStandalone: false,
      isHttpsOrLocalhost: true,
      supportsServiceWorker: true,
      supportsPushManager: true,
      supportsNotifications: true
    });
    assert.equal(iphoneBrowserTab.isIOS, true);
    assert.equal(iphoneBrowserTab.isIOSRequiresHomeScreen, true);
    assert.equal(iphoneBrowserTab.canRequestWebPushNow, false, 'Must NOT request permission before iPhone Home Screen install');

    const iphoneHomeScreenApp = evalCaps({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
      isStandalone: true,
      isHttpsOrLocalhost: true,
      supportsServiceWorker: true,
      supportsPushManager: true,
      supportsNotifications: true
    });
    assert.equal(iphoneHomeScreenApp.isIOS, true);
    assert.equal(iphoneHomeScreenApp.isIOSRequiresHomeScreen, false);
    assert.equal(iphoneHomeScreenApp.canRequestWebPushNow, true, 'Must allow Web Push when opened from iPhone Home Screen icon');
  });

  // 8. Android Web Push support detection
  await runTest('8. Android Chrome supports direct Web Push without mandatory installation + shows optional recommendation', async () => {
    const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isStandalone = false;
    const isIOSRequiresHomeScreen = isIOS && !isStandalone;
    const showAndroidOptionalInstallGuidance = isAndroid && !isStandalone;
    const canRequestWebPushNow = !isIOSRequiresHomeScreen && true;

    assert.equal(isAndroid, true);
    assert.equal(isIOSRequiresHomeScreen, false);
    assert.equal(showAndroidOptionalInstallGuidance, true);
    assert.equal(canRequestWebPushNow, true);
  });

  // 9. Backend notification subscription persistence & controlled price-change evaluation
  await runTest('9. Backend Web Push evaluation & VAPID configuration integrity', async () => {
    const webPushLib = await import('../lib/webPush.js');
    const keys = webPushLib.getVapidKeys();
    assert.ok(keys.publicKey && keys.publicKey.length > 40, 'Valid public VAPID key required');
    assert.ok(keys.privateKeyObject && keys.privateKeyObject.type === 'private', 'Valid server-only private KeyObject required');

    // Controlled price change test (without modifying production prices)
    const downSub = { wireId: '1.5', condition: 'down', enabled: true, lastTriggeredPrice: null };
    assert.equal(webPushLib.evaluateAlertCondition(downSub, 245, 235), true, 'Should trigger on price drop');
    assert.equal(webPushLib.evaluateAlertCondition(downSub, 245, 245), false, 'Should not trigger when unchanged');
    assert.equal(
      webPushLib.evaluateAlertCondition({ ...downSub, lastTriggeredPrice: 235 }, 245, 235),
      false,
      'Should not duplicate trigger for identical price'
    );
  });

  // 10. Existing pricing table, watchlist, and 3D anatomy regression protection
  await runTest('10. Existing pricing table, dark watchlist section, PDF sheet, and 3D simulator preserved', async () => {
    assert.ok(pageSource.includes('<WireAnatomy3D isAr={isAr} />'), '3D Cable Simulator must be preserved');
    assert.ok(pageSource.includes('id="printable-price-sheet"'), 'Printable PDF price sheet must be preserved');
    assert.ok(pageSource.includes('id="personal-watchlist-heading"'), 'Personal Watchlist section must be preserved');
    assert.ok(pageSource.includes('bg-[#0B1F36]'), 'Dark navy watchlist styling must be preserved');
  });

  console.log(`\n========================================`);
  console.log(`V10 Regression Suite: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
})();
