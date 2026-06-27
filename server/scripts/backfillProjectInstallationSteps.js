/**
 * backfillProjectInstallationSteps.js
 * Run with: node server/scripts/backfillProjectInstallationSteps.js [--force]
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const force = process.argv.includes('--force');

const mernSteps = [
  { label: 'Clone Repository', command: 'git clone <repository-url>' },
  { label: 'Install Client Dependencies', command: 'cd client && npm install' },
  { label: 'Install Server Dependencies', command: 'cd server && npm install' },
  { label: 'Configure Environment Variables', command: 'cp .env.example .env' },
  { label: 'Run Development Servers', command: 'npm run dev' }
];

const viteSteps = [
  { label: 'Clone Repository', command: 'git clone <repository-url>' },
  { label: 'Install Dependencies', command: 'npm install' },
  { label: 'Run Development Server', command: 'npm run dev' },
  { label: 'Build for Production', command: 'npm run build' }
];

const pythonSteps = [
  { label: 'Clone Repository', command: 'git clone <repository-url>' },
  { label: 'Create Virtual Environment', command: 'python -m venv venv' },
  { label: 'Install Dependencies', command: 'pip install -r requirements.txt' },
  { label: 'Run Application', command: 'streamlit run app.py' }
];

const knownProjectsSteps = {
  'HYRR - AI Resume & ATS Optimizer': mernSteps,
  'Techartistry.in Portfolio': mernSteps,
  'Pothole Detection using Deep Learning': pythonSteps,
  'ThinkFast Quiz App': viteSteps,
  'Mood-Based Travel Explorer': viteSteps,
  'TaskFlow To-Do List': viteSteps,
  'SkyCast Weather Forecast': viteSteps,
};

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const projects = await Project.find({});
    let updatedCount = 0;
    let skippedCount = 0;

    for (const project of projects) {
      if (!force && project.installationSteps && project.installationSteps.length > 0) {
        console.log(`Skipping "${project.title}" (already has installationSteps)`);
        skippedCount++;
        continue;
      }

      let newSteps = knownProjectsSteps[project.title];

      if (!newSteps) {
        if (project.category === 'ml') newSteps = pythonSteps;
        else if (project.category === 'fullstack') newSteps = mernSteps;
        else newSteps = viteSteps; // Default for 'web', 'other'
      }

      project.installationSteps = newSteps;
      await project.save();
      console.log(`Updated "${project.title}"`);
      updatedCount++;
    }

    console.log(`\nMigration complete. Updated: ${updatedCount}, Skipped: ${skippedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
