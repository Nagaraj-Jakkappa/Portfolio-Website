const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in the environment.");
  process.exit(1);
}

const hashMap = {
  "#Projects": "#projects",
  "#Contact": "#contact",
  "#Home": "#home"
};

async function fixHeroCtaAnchors() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    const content = await SiteContent.findOne();
    if (!content) {
      console.log('❌ No SiteContent found.');
      process.exit(1);
    }

    let modified = false;

    if (content.hero) {
      if (content.hero.primaryCtaHref && hashMap[content.hero.primaryCtaHref.trim()]) {
        console.log(`Updating primaryCtaHref from ${content.hero.primaryCtaHref} to ${hashMap[content.hero.primaryCtaHref.trim()]}`);
        content.hero.primaryCtaHref = hashMap[content.hero.primaryCtaHref.trim()];
        modified = true;
      }
      
      // If there are other CTAs in hero model, check them too, but primaryCtaHref is the main one.
    }

    if (modified) {
      await content.save();
      console.log('✅ Fixed hero CTA anchors in SiteContent.');
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

fixHeroCtaAnchors();
