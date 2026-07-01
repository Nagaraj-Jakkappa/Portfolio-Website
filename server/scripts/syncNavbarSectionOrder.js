require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

const DEFAULT_NAV_LABELS = {
  projects: "Projects",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  certifications: "Certifications",
  currentlyBuilding: "Building",
  techPulse: "Tech Pulse",
  now: "Now",
  engineeringHighlights: "Highlights",
  contact: "Contact"
};

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function syncNavbarSections() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    const content = await SiteContent.findOne();
    if (!content) {
      console.log('❌ No SiteContent found. Run the previous sync script or save via Admin Panel first.');
      process.exit(1);
    }

    if (!Array.isArray(content.homepageSections) || content.homepageSections.length === 0) {
      console.log('❌ No homepageSections found in SiteContent. Run the previous sync script first.');
      process.exit(1);
    }

    console.log('ℹ️ Syncing homepageSections with navLabel and showInNav...');
    
    let updatedCount = 0;
    const updatedSections = content.homepageSections.map((sec) => {
      let modified = false;
      
      const newSec = { ...sec.toObject() };

      if (typeof newSec.navLabel !== 'string' || !newSec.navLabel) {
        newSec.navLabel = DEFAULT_NAV_LABELS[newSec.key] || newSec.label;
        modified = true;
      }

      if (typeof newSec.showInNav !== 'boolean' || newSec.key === 'hero') {
        const newValue = newSec.key !== 'hero';
        if (newSec.showInNav !== newValue) {
          newSec.showInNav = newValue;
          modified = true;
        }
      }

      if (modified) updatedCount++;
      return newSec;
    });

    if (updatedCount > 0) {
      content.homepageSections = updatedSections;
      await content.save();
      console.log(`✅ Updated ${updatedCount} sections with nav fields in SiteContent.`);
    } else {
      console.log('✅ All sections already have navLabel and showInNav fields. No changes made.');
    }

    console.log('Detailed sections state:');
    content.homepageSections.forEach(s => {
      console.log(` - [${s.key}] navLabel: "${s.navLabel}", showInNav: ${s.showInNav}, order: ${s.order}`);
    });

  } catch (err) {
    console.error('❌ Sync failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

syncNavbarSections();
