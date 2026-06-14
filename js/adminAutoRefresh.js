/* =========================================================
   Admin auto-refresh + pending notification
   - Any new application (status pending) should cause
     admin panel to refresh and show a toast notification.
   - This implementation is device-local (localStorage).
   ========================================================= */

(function () {
  const LS_LAST_SEEN = 'bbs_admin_last_seen_ts_v1';
  const LS_NOTIF = 'bbs_admin_notif_v1';

  function storageGet(k) {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch {
      return null;
    }
  }

  function storageSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  }

  function getLastSeen() {
    const raw = localStorage.getItem(LS_LAST_SEEN);
    return raw ? parseInt(raw, 10) : 0;
  }

  function setLastSeen(ts) {
    localStorage.setItem(LS_LAST_SEEN, String(ts));
  }

  function notifyFromQueue() {
    const list = storageGet(LS_NOTIF) || [];
    const lastSeen = getLastSeen();

    const newOnes = list.filter(x => x && typeof x.ts === 'number' && x.ts > lastSeen);
    if (!newOnes.length) return;

    const latest = newOnes[newOnes.length - 1].ts;
    setLastSeen(latest);

    if (typeof toast === 'function') {
      newOnes.forEach(x => {
        const type = x.type || '';
        const tone = type.includes('approve') ? 'ok' : (type.includes('reject') ? 'err' : 'warn');
        toast(x.message || 'নতুন নোটিফিকেশন', tone);
      });
    }

    if (typeof window.renderAdminPanel === 'function') {
      window.renderAdminPanel();
    }
  }

  function startWatcher() {
    let lastCounts = { pending: null, approved: null };

    setInterval(() => {
      try {
        notifyFromQueue();

        if (typeof window.getUsersObject === 'function' && typeof window.renderAdminPanel === 'function') {
          const usersObj = window.getUsersObject() || {};
          const users = Object.values(usersObj).filter(u => u && u.role !== 'admin');
          const pending = users.filter(u => u.status === 'pending').length;
          const approved = users.filter(u => u.status === 'approved').length;

          if (lastCounts.pending === null) {
            lastCounts = { pending, approved };
            return;
          }

          if (pending !== lastCounts.pending || approved !== lastCounts.approved) {
            // Only refresh immediately when a new pending request arrives
            if (lastCounts.pending !== null && pending > lastCounts.pending) {
              // bump notification for admin UI consistency
              try {
                const list = storageGet(LS_NOTIF) || [];
                list.push({
                  type: 'admin-pending',
                  message: `নতুন আবেদন এসেছে (${pending}টি পেন্ডিং)`,
                  ts: Date.now()
                });
                while (list.length > 10) list.shift();
                storageSet(LS_NOTIF, list);
              } catch {}
              notifyFromQueue();
            }

            lastCounts = { pending, approved };
            window.renderAdminPanel();
          }

        }
      } catch {
        // silent
      }
    }, 2000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    startWatcher();
  });
})();

