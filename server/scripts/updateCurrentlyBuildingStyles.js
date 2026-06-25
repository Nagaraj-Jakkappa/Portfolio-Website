const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const SiteContent = require('../models/SiteContent');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DEFAULT_ITEMS = [
  { title: 'Pothole Detection', color: 'emerald', size: 'feature' },
  { title: 'ThinkFast Quiz', color: 'cyan', size: 'wide' },
  { title: 'Mood-Based Travel Explorer', color: 'violet', size: 'wide' },
  { title: 'SkyCast Weather Forecast', color: 'blue', size: 'small' },
  { title: 'TaskFlow To-Do List', color: 'amber', size: 'small' },
];

const DEFAULT_METRICS = [
  { label: 'MERN UPGRADES', color: 'blue', size: 'normal' },
  { label: 'SECURE AUTH', color: 'cyan', size: 'large' },
  { label: 'REST BACKEND', color: 'emerald', size: 'normal' },
  { label: 'MONGODB MODELS', color: 'violet', size: 'large' },
];

async function updateStyles() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected.');

    const content = await SiteContent.findOne();
    if (!content) {
      console.log('No SiteContent found.');
      process.exit(0);
    }

    let updated = false;

    if (content.currentlyBuilding && content.currentlyBuilding.length > 0) {
      content.currentlyBuilding.forEach(item => {
        const defaultMatch = DEFAULT_ITEMS.find(d => item.title && d.title && item.title.includes(d.title));
        if (!item.color || !['blue', 'cyan', 'emerald', 'amber', 'violet', 'purple', 'rose'].includes(item.color)) {
          item.color = defaultMatch ? defaultMatch.color : 'cyan';
          updated = true;
        }
        
        // Update size, explicitly mapping normal and compact to small if encountered
        if (item.size === 'normal' || item.size === 'compact') {
          item.size = 'small';
          updated = true;
        }
        
        if (!item.size || !['small', 'wide', 'tall', 'feature'].includes(item.size)) {
          item.size = defaultMatch ? defaultMatch.size : 'small';
          updated = true;
        }
      });
    }

    if (content.impactMetrics && content.impactMetrics.length > 0) {
      content.impactMetrics.forEach(metric => {
        const defaultMatch = DEFAULT_METRICS.find(d => metric.label && d.label && metric.label.includes(d.label));
        if (!metric.color || !['blue', 'cyan', 'emerald', 'amber', 'violet', 'purple', 'rose'].includes(metric.color)) {
          metric.color = defaultMatch ? defaultMatch.color : 'cyan';
          updated = true;
        }
        if (!metric.size || !['normal', 'large'].includes(metric.size)) {
          metric.size = defaultMatch ? defaultMatch.size : 'normal';
          updated = true;
        }
      });
    }

    if (updated) {
      await content.save();
      console.log('SiteContent updated successfully with color and size.');
    } else {
      console.log('No updates needed. Colors and sizes already exist.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateStyles();
