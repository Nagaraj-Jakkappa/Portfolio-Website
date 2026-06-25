import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackVisitorEvent } from '../../utils/visitorTracking';
import { Modal, Toggle, Btn } from '../admin/ui/ui';

export default function CookieBanner() {
  const [consent, setConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('techartistry_cookie_consent');
    }
    return null;
  });
  
  const [showPreferences, setShowPreferences] = useState(false);
  const [tempAnalytics, setTempAnalytics] = useState(consent !== 'rejected');

  useEffect(() => {
    const handleOpen = () => {
      setTempAnalytics(localStorage.getItem('techartistry_cookie_consent') !== 'rejected');
      setShowPreferences(true);
    };
    window.addEventListener('open_cookie_settings', handleOpen);
    return () => window.removeEventListener('open_cookie_settings', handleOpen);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('techartistry_cookie_consent', 'accepted');
    setConsent('accepted');
    setShowPreferences(false);
    // Fire tracking event immediately if it was pending
    trackVisitorEvent('cookie_consent_accepted');
  };

  const handleReject = () => {
    localStorage.setItem('techartistry_cookie_consent', 'rejected');
    setConsent('rejected');
    setShowPreferences(false);
    // Clear optional tracking keys
    localStorage.removeItem('techartistry_session_id');
    localStorage.removeItem('techartistry_visitor_insights_seen_at');
  };

  const handleSavePreferences = () => {
    if (tempAnalytics) {
      handleAccept();
    } else {
      handleReject();
    }
  };

  return (
    <>
      {!consent && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none flex justify-center">
          <div 
            className="w-full max-w-4xl bg-navy-900/95 backdrop-blur-md border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto"
            role="region"
            aria-label="Cookie consent banner"
          >
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">We value your privacy</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We use optional cookies to securely collect basic visitor insights to improve this portfolio. 
                You can read more in our <Link to="/cookies" className="text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded">Cookie Policy</Link>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button 
                onClick={() => setShowPreferences(true)}
                className="min-h-[44px] min-w-[44px] px-4 text-sm font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Manage Preferences
              </button>
              <button 
                onClick={handleReject}
                className="min-h-[44px] min-w-[44px] px-4 text-sm font-medium text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Reject All
              </button>
              <button 
                onClick={handleAccept}
                className="min-h-[44px] min-w-[44px] px-6 text-sm font-medium text-navy-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal 
        open={showPreferences} 
        onClose={() => setShowPreferences(false)}
        title="Cookie Preferences"
        subtitle="Manage how we use cookies and tracking on this site."
        maxWidth="max-w-lg"
        footer={
          <>
            <Btn variant="ghost" onClick={() => setShowPreferences(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={handleSavePreferences}>Save Preferences</Btn>
          </>
        }
      >
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Strictly Necessary Cookies</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                These cookies are required for the website to function securely and cannot be disabled. They include admin authentication and saving this consent preference.
              </p>
            </div>
            <div className="shrink-0 pt-1 pointer-events-none opacity-60">
              <Toggle value={true} onChange={() => {}} label="" />
            </div>
          </div>
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Analytics & Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optional local storage used to securely collect anonymous visitor insights (e.g., page views, device type) to help improve this portfolio.
              </p>
            </div>
            <div className="shrink-0 pt-1">
              <Toggle value={tempAnalytics} onChange={setTempAnalytics} label="" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
