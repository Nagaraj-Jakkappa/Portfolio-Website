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

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Nagaraj Jakkappa — Frontend Developer & React Specialist</title>

        <meta
          name="description"
          content="Nagaraj Jakkappa is a BCA graduate and frontend developer from Karnataka, India. Specializing in React, TypeScript, Node.js, and ML applications."
        />

        <meta
          name="keywords"
          content="Nagaraj Jakkappa, frontend developer, React developer, JavaScript, TypeScript, Karnataka, hire developer"
        />

        <meta property="og:title" content="Nagaraj Jakkappa — Frontend Developer" />

        <meta
          property="og:description"
          content="Building fast, accessible web experiences with React and Node.js."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content="https://techartistry.in" />

        <link rel="canonical" href="https://techartistry.in" />
      </Helmet>

      <Hero />
      <CurrentlyBuilding />

      <About />

      <NowSection />

      <Skills />

      <GithubPulse />

      <Certifications />

      <Projects />

      <RecruiterMode />

      <Contact />
    </>
  );
}
