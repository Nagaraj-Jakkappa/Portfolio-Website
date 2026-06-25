import { useEffect } from 'react';

export default function CookiePolicy() {
  useEffect(() => {
    document.title = 'Cookie Policy | Techartistry';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="section-padding bg-navy-900 min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl text-white mb-4">Cookie Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: June 25, 2026</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies (and similar technologies like localStorage) are small data files stored on your browser. 
              They are used to remember your preferences, secure the website, and provide basic analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Necessary Cookies</h2>
            <p>These cookies are essential for the website to function securely and cannot be switched off.</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Admin Authentication:</strong> Secure HTTP-only cookies used strictly for the site administrator to log in and manage content.</li>
              <li><strong>Consent Preferences:</strong> We use local storage (<code>techartistry_cookie_consent</code>) to remember whether you have accepted or rejected optional tracking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Optional Analytics & Tracking</h2>
            <p>With your explicit consent, we use local storage to collect basic visitor insights to improve our portfolio.</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Session Management (<code>techartistry_session_id</code>):</strong> A randomly generated identifier used to anonymously group your page views during a single visit.</li>
              <li><strong>UI State (<code>techartistry_visitor_insights_seen_at</code>):</strong> Used to track whether you have been introduced to specific UI elements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. How to Control Cookies</h2>
            <p>
              You have the right to accept or reject optional analytics tracking. You can manage your preferences on this website at any time by clicking the "Cookie Settings" button in the footer.
            </p>
            <p className="mt-2">
              If you reject tracking, all optional analytics keys will be cleared and no future tracking requests will be made. You can also manually clear your browser's cookies and local storage via your browser settings.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('open_cookie_settings'))}
              className="mt-6 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-cyan-500/30 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              Manage Cookie Settings
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
