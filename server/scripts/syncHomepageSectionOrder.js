const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in the environment.");
  process.exit(1);
}

const defaultOrder = [
  { key: "hero", label: "Home", order: 1, isLocked: true },
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

async function syncHomepageSectionOrder() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected.");

    let content = await SiteContent.findOne();
    if (!content) {
      console.log("⚠️ No SiteContent document found. Creating one with default homepageSections...");
      content = new SiteContent({ homepageSections: defaultOrder });
      await content.save();
      console.log("✅ Created new SiteContent with homepageSections.");
    } else {
      console.log("ℹ️ SiteContent found. Updating homepageSections...");
      content.homepageSections = defaultOrder;
      await content.save();
      console.log("✅ Updated SiteContent with default homepageSections order.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing homepage section order:", error);
    process.exit(1);
  }
}

syncHomepageSectionOrder();
