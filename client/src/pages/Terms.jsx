import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms & Conditions | Techartistry';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="section-padding bg-navy-900 min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl text-white mb-4">Terms & Conditions</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: June 25, 2026</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Website Purpose</h2>
            <p>
              This website (Techartistry.in) serves as a personal portfolio and developer profile to showcase software engineering projects and technical skills.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Content Ownership</h2>
            <p>
              Unless otherwise stated, all site design, project screenshots, and custom branding belong to Nagaraj Jakkappa. You may not reuse the content or branding for commercial purposes without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Project Demonstrations</h2>
            <p>
              Projects displayed are portfolio demonstration work. Live demos, source code, and associated APIs may be modified, updated, or made unavailable at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use</h2>
            <p>By using this website, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Misuse the contact forms by sending spam or unsolicited promotions.</li>
              <li>Attempt to scrape, exploit, or bypass the administrative areas and APIs.</li>
              <li>Engage in any activity that disrupts the website's functionality or security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. External Links</h2>
            <p>
              This website contains links to third-party sites such as GitHub, LinkedIn, and live project demos. We are not responsible for the content, privacy policies, or practices of any third-party websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              This website is provided "as is" without any warranties, express or implied. The owner will not be held responsible for any damages or losses arising from the use of this website or its content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
            <p>For any inquiries regarding these terms, please contact:</p>
            <p className="mt-2"><a href="mailto:nagupoojary33@gmail.com" className="text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded">nagupoojary33@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
