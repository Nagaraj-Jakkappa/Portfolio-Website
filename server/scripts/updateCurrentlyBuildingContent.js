/**
 * One-time script to update the Currently Building section content to Bento format.
 *
 * Usage:
 *   node server/scripts/updateCurrentlyBuildingContent.js
 *
 * Requires MONGO_URI in your .env.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

const NEW_BUILDING_CONTENT = [
  {
    title: 'Pothole Detection',
    description: 'Upgrading my AI-based pothole detection project with MERN features like image uploads, prediction history, user reports, and admin analytics.',
    status: 'IMPROVING',
    variant: 'small',
    order: 1,
    isActive: true,
  },
  {
    title: 'ThinkFast Quiz',
    description: 'Converting my frontend quiz app into a full MERN quiz platform with authentication, categories, scores, leaderboard, and admin question management.',
    status: 'ACTIVE',
    variant: 'small',
    order: 2,
    isActive: true,
  },
  {
    title: 'Mood-Based Travel Explorer',
    description: 'Improving the travel explorer frontend into a MERN app with saved trips, mood-based suggestions, user journals, and personalized travel boards.',
    status: 'IMPROVING',
    variant: 'wide',
    order: 3,
    isActive: true,
  },
  {
    title: 'SkyCast Weather Forecast',
    description: 'Building the weather forecast app further with saved locations, forecast history, alerts, user preferences, and clean API integration.',
    status: 'ACTIVE',
    variant: 'full',
    order: 4,
    isActive: true,
  },
  {
    title: 'TaskFlow To-Do List',
    description: 'Upgrading my task manager into a production-ready MERN app with login, task CRUD, priorities, reminders, filters, and dashboard insights.',
    status: 'ACTIVE',
    variant: 'full',
    order: 5,
    isActive: true,
  },
];

const NEW_IMPACT_METRICS = [
  { value: '5', label: 'MERN UPGRADES', description: '', variant: 'small', order: 1, isActive: true },
  { value: 'JWT', label: 'SECURE AUTH', description: '', variant: 'small', order: 2, isActive: true },
  { value: 'API', label: 'REST BACKEND', description: '', variant: 'small', order: 3, isActive: true },
  { value: 'DB', label: 'MONGODB MODELS', description: '', variant: 'small', order: 4, isActive: true },
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: MONGO_URI not set. Add it to your .env.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const content = await SiteContent.findOne({});
  if (!content) {
    console.log('No SiteContent document found. Creating one...');
    await SiteContent.create({ 
      currentlyBuilding: NEW_BUILDING_CONTENT,
      impactMetrics: NEW_IMPACT_METRICS
    });
    console.log('Created SiteContent with new Currently Building & Impact Metrics data.');
  } else {
    console.log('Found existing SiteContent document. Updating arrays...');
    content.currentlyBuilding = NEW_BUILDING_CONTENT;
    content.impactMetrics = NEW_IMPACT_METRICS;
    await content.save();
    console.log('Updated existing SiteContent with new Currently Building & Impact Metrics data.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
