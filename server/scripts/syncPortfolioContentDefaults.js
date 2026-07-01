require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

async function syncDefaults() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Missing MONGO_URI. Make sure your .env file is loaded.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
    }

    let modified = false;

    // Sync Hero Fields
    if (!content.hero.badge) {
      content.hero.badge = "OPEN FOR FRONTEND & FULL STACK ROLES";
      modified = true;
    }
    if (!content.hero.headline) {
      content.hero.headline = "Building Production-Ready Web Applications";
      modified = true;
    }
    if (!content.hero.name) {
      content.hero.name = "Nagaraj Jakkappa";
      modified = true;
    }
    if (!content.hero.roles || content.hero.roles.length === 0) {
      content.hero.roles = [
        "MERN Stack Developer",
        "Frontend Developer",
        "React Developer",
        "Full Stack Developer",
        "Software Developer"
      ];
      modified = true;
    }
    if (!content.hero.description) {
      content.hero.description = "I build and ship full-stack web apps with React, Node.js, Express, and MongoDB — from AI-powered SaaS platforms to secure CMS dashboards, with clean code, responsive UI, and production-minded security.";
      modified = true;
    }
    if (!content.hero.stats || content.hero.stats.length === 0) {
      content.hero.stats = [
        { value: "6+", label: "LIVE PROJECTS", order: 1, isActive: true },
        { value: "MERN", label: "STACK", order: 2, isActive: true },
        { value: "8.26", label: "BCA CGPA", order: 3, isActive: true },
        { value: "1", label: "INTERNSHIP", order: 4, isActive: true }
      ];
      modified = true;
    }

    // Sync About Fields
    if (!content.about.paragraphs || content.about.paragraphs.length === 0) {
      content.about.paragraphs = [
        "Hi, I’m Nagaraj Jakkappa — a MERN Stack Developer from Yadgir, Karnataka, focused on building secure, scalable, and production-ready web applications with React, Node.js, Express, and MongoDB.",
        "I build full-stack projects that solve real problems — from HYRR, an AI resume and ATS optimizer, to Techartistry, a secure portfolio CMS, and a TensorFlow/MobileNetV2 pothole detection system.",
        "As a BCA graduate with a CGPA of 8.26, I’m actively seeking full-time Frontend Developer or MERN Stack Developer roles where I can contribute to impactful products with clean code, modern UI, and strong security practices."
      ];
      modified = true;
    }
    
    if (!content.about.highlightKeywords || content.about.highlightKeywords.length === 0) {
      content.about.highlightKeywords = [
        "Nagaraj Jakkappa",
        "MERN Stack Developer",
        "HYRR",
        "Techartistry",
        "TensorFlow/MobileNetV2",
        "CGPA of 8.26"
      ];
      modified = true;
    }

    if (modified) {
      await content.save();
      console.log('SiteContent updated with new Hero and About defaults successfully.');
    } else {
      console.log('SiteContent already has Hero and About fields. No changes made.');
    }

  } catch (error) {
    console.error('Error syncing content:', error);
  } finally {
    mongoose.connection.close();
  }
}

syncDefaults();
