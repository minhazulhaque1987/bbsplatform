(function () {
  const DEFAULT_MANIFEST_URL = window.APP_UPDATE_MANIFEST_URL || '';
  const DEFAULT_DB_PATH = window.APP_UPDATE_DB_PATH || 'app/update';
  const LOCAL_APP_VERSION = window.APP_LOCAL_VERSION || {
    versionCode: 2,
    versionName: '1.1'
  };

  function ensureModalStyles() {
    if (document.getElementById('app-update-styles')) return;
    const style = document.createElement('style');
    style.id = 'app-update-styles';
    style.textContent = `
      .app-update-overlay{position:fixed;inset:0;background:rgba(15,23,42,.58);backdrop-filter:blur(10px);display:none;align-items:center;justify-content:center;padding:20px;z-index:99999}
      .app-update-overlay.on{display:flex}
      .app-update-card{width:min(100%,420px);background:#fff;border-radius:24px;box-shadow:0 24px 80px rgba(15,23,42,.28);overflow:hidden;font-family:inherit}
      .app-update-head{padding:20px 20px 14px;background:linear-gradient(135deg,#0f172a,#1d4ed8);color:#fff}
      .app-update-title{font-size:20px;font-weight:800;line-height:1.2;margin:0 0 6px}
      .app-update-sub{font-size:13px;opacity:.9;margin:0}
      .app-update-body{padding:18px 20px 20px;color:#0f172a}
      .app-update-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0 16px}
      .app-update-chip{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:10px 12px}
      .app-update-chip b{display:block;font-size:11px;color:#64748b;margin-bottom:3px;letter-spacing:.04em;text-transform:uppercase}
      .app-update-chip span{font-size:14px;font-weight:700;color:#0f172a}
      .app-update-msg{font-size:14px;line-height:1.6;color:#334155;margin:0}
      .app-update-actions{display:grid;gap:10px;margin-top:18px}
      .app-update-btn{border:none;border-radius:14px;padding:14px 16px;font-size:14px;font-weight:800;cursor:pointer}
      .app-update-btn.primary{background:#2563eb;color:#fff}
      .app-update-btn.ghost{background:#f1f5f9;color:#0f172a}
      .app-update-note{font-size:11px;color:#64748b;line-height:1.5;margin-top:10px}
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    if (document.getElementById('app-update-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'app-update-overlay';
    overlay.className = 'app-update-overlay';
    overlay.innerHTML = `
      <div class="app-update-card" role="dialog" aria-modal="true" aria-labelledby="app-update-title">
        <div class="app-update-head">
          <h3 class="app-update-title" id="app-update-title">নতুন আপডেট এসেছে</h3>
          <p class="app-update-sub">নতুন ভার্সনটি এখনই ইনস্টল করতে পারেন</p>
        </div>
        <div class="app-update-body">
          <p class="app-update-msg" id="app-update-msg"></p>
          <div class="app-update-meta">
            <div class="app-update-chip"><b>বর্তমান ভার্সন</b><span id="app-update-current"></span></div>
            <div class="app-update-chip"><b>নতুন ভার্সন</b><span id="app-update-new"></span></div>
          </div>
          <div class="app-update-actions">
            <button type="button" class="app-update-btn primary" id="app-update-download">APK ডাউনলোড / খুলুন</button>
            <button type="button" class="app-update-btn ghost" id="app-update-later">পরে করব</button>
          </div>
          <div class="app-update-note">নোট: Android নিরাপত্তার কারণে ইনস্টল করার সময় user permission লাগতে পারে।</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  function compareVersions(remoteCode, localCode) {
    return Number(remoteCode || 0) > Number(localCode || 0);
  }

  async function fetchManifest(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function fetchManifestFromDB(path) {
    if (!window.database) return null;
    const snap = await window.database.ref(path).once('value');
    return snap.val();
  }

  function openApk(url) {
    if (!url) return;
    const resolved = resolveApkUrl(url);
    try {
      window.open(resolved, '_system');
    } catch {
      window.open(resolved, '_blank');
    }
  }

  function resolveApkUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return raw;

    const fileMatch = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (fileMatch && fileMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
    }

    const ucMatch = raw.match(/[?&]id=([^&]+)/i);
    if (/drive\.google\.com/i.test(raw) && ucMatch && ucMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${ucMatch[1]}`;
    }

    return raw;
  }

  function showUpdatePrompt(manifest) {
    ensureModalStyles();
    createModal();

    const overlay = document.getElementById('app-update-overlay');
    const msg = document.getElementById('app-update-msg');
    const cur = document.getElementById('app-update-current');
    const nw = document.getElementById('app-update-new');
    const downloadBtn = document.getElementById('app-update-download');
    const laterBtn = document.getElementById('app-update-later');

    cur.textContent = `${LOCAL_APP_VERSION.versionName} (${LOCAL_APP_VERSION.versionCode})`;
    nw.textContent = `${manifest.versionName || manifest.versionCode || 'নতুন ভার্সন'}`;
    msg.textContent = manifest.message || 'একটি নতুন আপডেট পাওয়া গেছে। নতুন APK ডাউনলোড করে ইনস্টল করুন।';

    downloadBtn.onclick = () => openApk(manifest.apkUrl || manifest.downloadUrl);
    laterBtn.onclick = () => overlay.classList.remove('on');
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.classList.remove('on');
    };

    overlay.classList.add('on');
  }

  async function checkForUpdate() {
    try {
      let manifest = null;
      if (DEFAULT_MANIFEST_URL) {
        manifest = await fetchManifest(DEFAULT_MANIFEST_URL);
      } else {
        manifest = await fetchManifestFromDB(DEFAULT_DB_PATH);
      }
      if (!manifest) return;
      if (compareVersions(manifest.versionCode, LOCAL_APP_VERSION.versionCode)) {
        showUpdatePrompt(manifest);
      }
    } catch (err) {
      console.warn('Update check skipped:', err.message);
    }
  }

  window.checkForAppUpdate = checkForUpdate;
  window.showAppUpdatePrompt = showUpdatePrompt;
  window.resolveApkUrl = resolveApkUrl;

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkForUpdate, 1800);
  });
})();
