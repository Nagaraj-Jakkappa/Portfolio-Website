const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const SiteContent = require('../models/SiteContent');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DEFAULT_ITEMS = [
  { title: 'Pothole Detection', color: 'emerald', size: 'small' },
  { title: 'ThinkFast Quiz', color: 'cyan', size: 'small' },
  { title: 'Mood-Based Travel Explorer', color: 'violet', size: 'wide' },
  { title: 'SkyCast Weather Forecast', color: 'blue', size: 'full' },
  { title: 'TaskFlow To-Do List', color: 'amber', size: 'full' },
];

const DEFAULT_METRICS = [
  { label: 'MERN UPGRADES', color: 'blue', size: 'small' },
  { label: 'SECURE AUTH', color: 'cyan', size: 'small' },
  { label: 'REST BACKEND', color: 'emerald', size: 'small' },
  { label: 'MONGODB MODELS', color: 'violet', size: 'small' },
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
        
        // 1. Fallback to size if missing but variant exists
        if (!item.size && item.variant) {
          if (['small', 'wide', 'full'].includes(item.variant)) {
            item.size = item.variant;
          } else if (item.variant === 'medium') {
            item.size = defaultMatch ? defaultMatch.size : 'small';
          } else if (item.variant === 'large') {
            item.size = defaultMatch ? defaultMatch.size : 'small';
          }
          updated = true;
        }

        // 2. Map legacy size values
        if (item.size === 'normal' || item.size === 'compact' || item.size === 'medium') {
          item.size = 'small';
          updated = true;
        } else if (item.size === 'large') {
          item.size = defaultMatch ? defaultMatch.size : 'small';
          updated = true;
        }
        
        // 3. Fallback to default match if completely missing or invalid
        if (!item.size || !['small', 'wide', 'tall', 'feature', 'full'].includes(item.size)) {
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
        if (!metric.size && metric.variant) {
          if (['small', 'wide', 'large'].includes(metric.variant)) {
            metric.size = metric.variant;
          } else {
            metric.size = 'small';
          }
          updated = true;
        }

        if (metric.size === 'normal' || metric.size === 'compact' || metric.size === 'medium') {
          metric.size = 'small';
          updated = true;
        }

        if (!metric.size || !['small', 'wide', 'large'].includes(metric.size)) {
          metric.size = defaultMatch ? defaultMatch.size : 'small';
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
