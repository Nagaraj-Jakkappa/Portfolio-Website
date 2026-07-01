const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in the environment.");
  process.exit(1);
}

async function fixHomeNavAndHeroButtons() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    const content = await SiteContent.findOne();
    if (!content) {
      console.log('❌ No SiteContent found.');
      process.exit(1);
    }

    if (!Array.isArray(content.homepageSections) || content.homepageSections.length === 0) {
      console.log('❌ No homepageSections found in SiteContent.');
      process.exit(1);
    }

    let modified = false;
    const updatedSections = content.homepageSections.map((sec) => {
      const newSec = { ...sec.toObject() };
      
      if (newSec.key === 'hero') {
        console.log('Found "hero" section. Current values:');
        console.log(`  label: ${newSec.label}`);
        console.log(`  navLabel: ${newSec.navLabel}`);
        console.log(`  showInDesktopNav: ${newSec.showInDesktopNav}`);
        console.log(`  showInMobileNav: ${newSec.showInMobileNav}`);

        newSec.label = 'Home';
        newSec.navLabel = 'Home';
        newSec.showInDesktopNav = true;
        newSec.showInMobileNav = true;
        
        console.log('Updated to:');
        console.log(`  label: ${newSec.label}`);
        console.log(`  navLabel: ${newSec.navLabel}`);
        console.log(`  showInDesktopNav: ${newSec.showInDesktopNav}`);
        console.log(`  showInMobileNav: ${newSec.showInMobileNav}`);
        
        modified = true;
      }
      return newSec;
    });

    if (modified) {
      content.homepageSections = updatedSections;
      await content.save();
      console.log('✅ Fixed hero -> Home in SiteContent.');
    } else {
      console.log('✅ No changes needed.');
    }
  } catch (err) {
    console.error('❌ Error during script execution:', err);
  } finally {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected.');
    process.exit(0);
  }
}

fixHomeNavAndHeroButtons();
