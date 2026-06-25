import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Techartistry';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="section-padding bg-navy-900 min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: June 25, 2026</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Who We Are</h2>
            <p>
              This website is the personal portfolio of Nagaraj Jakkappa, operating as Techartistry.in. 
              The purpose of this site is to showcase projects, skills, and professional experience.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. What Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Contact Information:</strong> If you use our contact form, we collect the name, email address, and message you provide.</li>
              <li><strong>Visitor Analytics (Optional):</strong> With your consent, we collect basic technical data such as device type, browser, OS, and pages visited to understand how the portfolio is used.</li>
              <li><strong>Administrative Data:</strong> Necessary authentication cookies are used solely for the site administrator to log in and manage content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
            <p>Any information collected is used strictly for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>To respond to your inquiries and messages.</li>
              <li>To measure portfolio engagement and improve the website experience.</li>
              <li>To secure and administer the website.</li>
            </ul>
            <p className="mt-3 text-cyan-400">We do not sell, rent, or unnecessarily share your personal data with third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p>We use trusted third-party services that may process basic technical data:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Vercel & Render:</strong> For frontend and backend hosting.</li>
              <li><strong>MongoDB Atlas:</strong> For secure database hosting.</li>
              <li><strong>Cloudinary:</strong> For image asset delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your Choices</h2>
            <p>
              You can choose to accept or reject optional visitor tracking using the cookie settings on our website. 
              If you have contacted us and wish to have your information removed, you may request so at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at:</p>
            <p className="mt-2"><a href="mailto:nagupoojary33@gmail.com" className="text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded">nagupoojary33@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
