/* Android hardware back button support */
(function () {
  const cap = window.Capacitor || null;
  const appPlugin = cap && cap.Plugins ? cap.Plugins.App : null;
  const isNative = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
  let lastHandledAt = 0;

  function shouldSkipRapidTap() {
    const now = Date.now();
    if (now - lastHandledAt < 250) return true;
    lastHandledAt = now;
    return false;
  }

  function exitApp() {
    if (appPlugin && typeof appPlugin.exitApp === 'function') {
      appPlugin.exitApp();
      return;
    }
    if (window.navigator && window.navigator.app && typeof window.navigator.app.exitApp === 'function') {
      window.navigator.app.exitApp();
      return;
    }
    window.close();
  }

  function confirmExitFromDashboard() {
    const ok = window.confirm('আপনি কি অ্যাপ থেকে বের হতে চান?');
    if (ok) exitApp();
  }

  function handleBackPress() {
    if (shouldSkipRapidTap()) return;

    const current = typeof window.getCurrentView === 'function' ? window.getCurrentView() : null;
    if (current === 'v-dash') {
      confirmExitFromDashboard();
      return;
    }

    if (typeof window.goBack === 'function' && window.goBack()) {
      return;
    }

    if (current && current !== 'v-dash' && typeof window.goView === 'function') {
      window.goView('v-dash', true);
      return;
    }

    confirmExitFromDashboard();
  }

  function bindDeviceBack() {
    if (isNative) document.body.classList.add('use-device-back');

    if (appPlugin && typeof appPlugin.addListener === 'function') {
      appPlugin.addListener('backButton', handleBackPress);
      return;
    }

    document.addEventListener('backbutton', function (e) {
      e.preventDefault();
      handleBackPress();
    }, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindDeviceBack);
  } else {
    bindDeviceBack();
  }
})();
