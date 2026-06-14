/* ═══════════ PUSH NOTIFICATIONS (FCM) ═══════════
 * Handles remote notifications from Firebase.
 * Works even when the app is in background or closed.
 * ════════════════════════════════════════════════ */

const PushNotifications = (function() {
    let _ready = false;

    function isNative() {
        return typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
    }

    async function init() {
        if (_ready || !isNative()) return;

        console.log('[Push] Initializing Push Notifications...');

        const { PushNotifications } = Capacitor.Plugins;

        if (!PushNotifications) {
            console.error('[Push] PushNotifications plugin not found');
            return;
        }

        // Request permission
        let perm = await PushNotifications.checkPermissions();
        if (perm.receive !== 'granted') {
            perm = await PushNotifications.requestPermissions();
        }

        if (perm.receive !== 'granted') {
            console.warn('[Push] User denied permissions');
            return;
        }

        // Register with FCM
        await PushNotifications.register();

        // Listeners
        PushNotifications.addListener('registration', (token) => {
            console.log('[Push] FCM Registration token:', token.value);
            // You can send this token to your server/database here
            saveTokenToDatabase(token.value);
        });

        PushNotifications.addListener('registrationError', (error) => {
            console.error('[Push] Registration error:', error.error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('[Push] Notification received:', notification);
            // Show a toast or update UI if app is open
            if (typeof toast === 'function') {
                toast(notification.title || 'নতুন বিজ্ঞপ্তি', 'success');
            }
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
            console.log('[Push] Action performed:', action);
            const data = action.notification.data;
            
            // Navigate based on data if provided
            if (data && data.view && typeof goView === 'function') {
                setTimeout(() => {
                    goView(data.view);
                }, 500);
            } else {
                // Default: go to dash
                if (typeof goView === 'function') goView('v-dash');
            }
        });

        _ready = true;
        console.log('[Push] Ready');
    }

    function saveTokenToDatabase(token) {
        // If user is logged in, save token to Firebase Realtime Database
        if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
            const uid = firebase.auth().currentUser.uid;
            firebase.database().ref('users/' + uid + '/fcmToken').set(token)
                .then(() => console.log('[Push] Token saved to database'))
                .catch(e => console.warn('[Push] Failed to save token:', e));
        }
    }

    return {
        init: init
    };
})();

// Auto-init on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PushNotifications.init());
} else {
    PushNotifications.init();
}
