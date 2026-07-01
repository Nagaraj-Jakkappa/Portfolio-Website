require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

const DEFAULT_NAV_VISIBILITY = {
  hero: {
    navLabel: "Home",
    showInDesktopNav: true,
    showInMobileNav: true,
  },
  projects: {
    navLabel: "Projects",
    showInDesktopNav: true,
    showInMobileNav: true,
  },
  about: {
    navLabel: "About",
    showInDesktopNav: true,
    showInMobileNav: true,
  },
  skills: {
    navLabel: "Skills",
    showInDesktopNav: true,
    showInMobileNav: true,
  },
  experience: {
    navLabel: "Experience",
    showInDesktopNav: true,
    showInMobileNav: true,
  },
  certifications: {
    navLabel: "Certifications",
    showInDesktopNav: true,
    showInMobileNav: true,
  },
  currentlyBuilding: {
    navLabel: "Building",
    showInDesktopNav: false,
    showInMobileNav: true,
  },
  techPulse: {
    navLabel: "Tech Pulse",
    showInDesktopNav: false,
    showInMobileNav: true,
  },
  now: {
    navLabel: "Now",
    showInDesktopNav: false,
    showInMobileNav: true,
  },
  engineeringHighlights: {
    navLabel: "Highlights",
    showInDesktopNav: false,
    showInMobileNav: true,
  },
  contact: {
    navLabel: "Contact",
    showInDesktopNav: true,
    showInMobileNav: true,
  },
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

    console.log('ℹ️ Syncing homepageSections with responsive nav fields...');
    
    let updatedCount = 0;
    const updatedSections = content.homepageSections.map((sec) => {
      let modified = false;
      
      const newSec = { ...sec.toObject() };
      
      const defaultVis = DEFAULT_NAV_VISIBILITY[newSec.key] || {
        navLabel: newSec.label || newSec.key,
        showInDesktopNav: true,
        showInMobileNav: true
      };

      if (typeof newSec.navLabel !== 'string' || !newSec.navLabel) {
        newSec.navLabel = defaultVis.navLabel;
        modified = true;
      }

      if (newSec.showInDesktopNav !== defaultVis.showInDesktopNav) {
        newSec.showInDesktopNav = defaultVis.showInDesktopNav;
        modified = true;
      }
      
      if (newSec.showInMobileNav !== defaultVis.showInMobileNav) {
        newSec.showInMobileNav = defaultVis.showInMobileNav;
        modified = true;
      }

      if (modified) updatedCount++;
      return newSec;
    });

    if (updatedCount > 0) {
      content.homepageSections = updatedSections;
      await content.save();
      console.log(`✅ Updated ${updatedCount} sections with responsive nav fields in SiteContent.`);
    } else {
      console.log('✅ All sections already have showInDesktopNav and showInMobileNav fields. No changes made.');
    }

    console.log('Detailed sections state:');
    content.homepageSections.forEach(s => {
      console.log(` - [${s.key}] desktop: ${s.showInDesktopNav}, mobile: ${s.showInMobileNav}`);
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
