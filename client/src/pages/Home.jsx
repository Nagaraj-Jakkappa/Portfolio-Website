import { Helmet } from 'react-helmet-async';

import Hero from '../components/sections/Hero';
import CurrentlyBuilding from '../components/sections/CurrentlyBuilding';
import About from '../components/sections/About';
import NowSection from '../components/sections/NowSection';
import Skills from '../components/sections/Skills';
import GithubPulse from '../components/sections/GithubPulse';
import Certifications from '../components/sections/Certifications';
import Projects from '../components/sections/Projects';
import RecruiterMode from '../components/sections/RecruiterMode';
import Contact from '../components/sections/Contact';

export default function Home({ content }) {

  return (
    <>
      <Helmet>
        <title>{content?.seo?.title || 'Nagaraj Jakkappa — Frontend Developer & React Specialist'}</title>
        <meta
          name="description"
          content={content?.seo?.description || "Nagaraj Jakkappa is a BCA graduate and frontend developer from Karnataka, India. Specializing in React, TypeScript, Node.js, and ML applications."}
        />
        <meta
          name="keywords"
          content={content?.seo?.keywords || "Nagaraj Jakkappa, frontend developer, React developer, JavaScript, TypeScript, Karnataka, hire developer"}
        />
        <meta property="og:title" content={content?.seo?.title || "Nagaraj Jakkappa — Frontend Developer"} />
        <meta
          property="og:description"
          content={content?.seo?.description || "Building fast, accessible web experiences with React and Node.js."}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.techartistry.in/" />
        {content?.seo?.ogImage && <meta property="og:image" content={content.seo.ogImage} />}
        
        <meta name="twitter:card" content={content?.seo?.twitterImage ? "summary_large_image" : "summary"} />
        {content?.seo?.twitterImage && <meta name="twitter:image" content={content.seo.twitterImage} />}
        <link rel="canonical" href="https://www.techartistry.in/" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Nagaraj Jakkappa Portfolio",
            "url": "https://www.techartistry.in/"
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Nagaraj Jakkappa",
            "url": "https://www.techartistry.in/",
            "jobTitle": "Frontend Developer",
            "alumniOf": "Alva's College",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Karnataka",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://github.com/Nagaraj-Jakkappa",
              "https://linkedin.com/in/nagaraj-jakkappa"
            ]
          })}
        </script>
      </Helmet>

      <Hero content={content} />
      <CurrentlyBuilding content={content} />

      <About content={content} />

      <NowSection />

      <Skills />

      <GithubPulse />

      <Certifications />

      <Projects />

      <RecruiterMode />

      <Contact content={content} />
    </>
  );
}
