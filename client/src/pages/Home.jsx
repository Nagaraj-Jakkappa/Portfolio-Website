import { Helmet } from 'react-helmet-async';

import Hero from '../components/sections/Hero';
import CurrentlyBuilding from '../components/sections/CurrentlyBuilding';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import NowSection from '../components/sections/NowSection';
import Skills from '../components/sections/Skills';
import GithubPulse from '../components/sections/GithubPulse';
import Certifications from '../components/sections/Certifications';
import Projects from '../components/sections/Projects';
import RecruiterMode from '../components/sections/RecruiterMode';
import Contact from '../components/sections/Contact';

const DEFAULT_SECTION_ORDER = [
  { key: "hero", label: "Hero", order: 1, isLocked: true },
  { key: "projects", label: "Featured Work", order: 2, isLocked: false },
  { key: "about", label: "About", order: 3, isLocked: false },
  { key: "skills", label: "My Tech Stack", order: 4, isLocked: false },
  { key: "experience", label: "Hands-on Experience", order: 5, isLocked: false },
  { key: "certifications", label: "Certifications & Education", order: 6, isLocked: false },
  { key: "currentlyBuilding", label: "Currently Building & Technical Proof", order: 7, isLocked: false },
  { key: "techPulse", label: "Tech Pulse", order: 8, isLocked: false },
  { key: "now", label: "Now", order: 9, isLocked: false },
  { key: "engineeringHighlights", label: "Engineering Highlights", order: 10, isLocked: false },
  { key: "contact", label: "Contact", order: 11, isLocked: false }
];

export default function Home({ content, loading }) {
  const sectionMap = {
    hero: <Hero content={content} key="hero" />,
    projects: <Projects key="projects" />,
    about: <About content={content} key="about" />,
    skills: <Skills content={content} key="skills" />,
    experience: <Experience key="experience" />,
    certifications: <Certifications content={content} key="certifications" />,
    currentlyBuilding: <CurrentlyBuilding content={content} loading={loading} key="currentlyBuilding" />,
    techPulse: <GithubPulse items={content?.techPulse} key="techPulse" />,
    now: <NowSection items={content?.now} key="now" />,
    engineeringHighlights: <RecruiterMode items={content?.engineeringHighlights} content={content} key="engineeringHighlights" />,
    contact: <Contact content={content} key="contact" />
  };

  const sectionsToRender = Array.isArray(content?.homepageSections) && content.homepageSections.length > 0
    ? [...content.homepageSections].sort((a, b) => a.order - b.order)
    : DEFAULT_SECTION_ORDER;

  return (
    <>
      <Helmet>
        <title>{content?.seo?.title || 'Nagaraj Jakkappa — MERN Stack Developer Portfolio'}</title>
        <meta
          name="description"
          content={content?.seo?.description || "Explore full-stack React, Node.js, MongoDB, AI, and dashboard projects by Nagaraj Jakkappa."}
        />
        <meta
          name="keywords"
          content={content?.seo?.keywords || "Nagaraj Jakkappa, frontend developer, React developer, JavaScript, TypeScript, Karnataka, hire developer"}
        />
        <meta property="og:title" content={content?.seo?.title || "Nagaraj Jakkappa — MERN Stack Developer Portfolio"} />
        <meta
          property="og:description"
          content={content?.seo?.description || "Explore full-stack React, Node.js, MongoDB, AI, and dashboard projects by Nagaraj Jakkappa."}
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
            "jobTitle": "MERN Stack Developer",
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

      {sectionsToRender.map((section) => {
        if (!sectionMap[section.key]) return null;
        return sectionMap[section.key];
      })}
    </>
  );
}
