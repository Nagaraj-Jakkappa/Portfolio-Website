// client/src/utils/visitorTracking.js

const SESSION_KEY = 'techartistry_session_id';

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge') || ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Other';
}

function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('X11') || ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('like Mac')) return 'iOS';
  return 'Other';
}

export function trackVisitorEvent(eventType, metadata = {}) {
  // Do not track locally
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return;
  }

  // Gate optional tracking behind consent
  if (typeof window !== 'undefined') {
    const consent = localStorage.getItem('techartistry_cookie_consent');
    if (consent !== 'accepted') {
      return;
    }
  }

  try {
    const payload = {
      eventType,
      page: window.location.pathname,
      path: window.location.pathname + window.location.search,
      title: document.title,
      referrer: document.referrer,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      sessionId: getSessionId(),
      metadata,
    };

    // Hardcoded same-origin URL for tracking to use Vercel proxy
    const endpoint = '/api/site/ping';

    // Fire and forget, don't await, catch errors silently
    if (navigator.sendBeacon) {
      // sendBeacon prefers FormData or Blob/String
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // fail silently
      });
    }
  } catch (error) {
    // silently fail
  }
}
