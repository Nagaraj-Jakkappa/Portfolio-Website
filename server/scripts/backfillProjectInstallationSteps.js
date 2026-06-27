/**
 * backfillProjectInstallationSteps.js
 * Run with: node server/scripts/backfillProjectInstallationSteps.js [--force] [--fix-placeholders]
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Project = require('../models/Project');

const force = process.argv.includes('--force');
const fixPlaceholders = process.argv.includes('--fix-placeholders');

const getMernSteps = (repoUrl) => [
  { label: 'Clone Repository', command: `git clone ${repoUrl}` },
  { label: 'Install Client Dependencies', command: 'cd client && npm install' },
  { label: 'Install Server Dependencies', command: 'cd server && npm install' },
  { label: 'Configure Environment Variables', command: 'create server/.env and add MongoDB/JWT/API keys' },
  { label: 'Run Backend Server', command: 'cd server && npm run dev' },
  { label: 'Run Frontend App', command: 'cd client && npm run dev' },
  { label: 'Build Frontend', command: 'cd client && npm run build' }
];

const getViteSteps = (repoUrl) => [
  { label: 'Clone Repository', command: `git clone ${repoUrl}` },
  { label: 'Install Dependencies', command: 'npm install' },
  { label: 'Run Development Server', command: 'npm run dev' },
  { label: 'Build for Production', command: 'npm run build' },
  { label: 'Preview Production Build', command: 'npm run preview' }
];

const getPythonSteps = (repoUrl) => [
  { label: 'Clone Repository', command: `git clone ${repoUrl}` },
  { label: 'Create Virtual Environment', command: 'python -m venv venv' },
  { label: 'Activate Virtual Environment', command: '.\\venv\\Scripts\\activate' },
  { label: 'Install Dependencies', command: 'pip install -r requirements.txt' },
  { label: 'Run Application', command: 'streamlit run app.py' }
];

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
    let fixedCount = 0;

    for (const project of projects) {
      const repoUrl = project.githubUrl || 'Add GitHub repository URL from Admin Panel';
      
      let hasPlaceholder = false;
      if (project.installationSteps && project.installationSteps.length > 0) {
        hasPlaceholder = project.installationSteps.some(step => step.command.includes('<repository-url>'));
      }

      if (!force && project.installationSteps && project.installationSteps.length > 0) {
        if (fixPlaceholders && hasPlaceholder) {
          // Proceed to fix
        } else {
          console.log(`Skipping "${project.title}" (already has steps)`);
          skippedCount++;
          continue;
        }
      }

      let newSteps;
      if (project.title === 'HYRR - AI Resume & ATS Optimizer' || project.title === 'Techartistry.in Portfolio') {
        newSteps = getMernSteps(repoUrl);
      } else if (project.title === 'Pothole Detection using Deep Learning') {
        newSteps = getPythonSteps(repoUrl);
      } else {
        newSteps = getViteSteps(repoUrl);
      }

      project.installationSteps = newSteps;
      await project.save();
      
      if (fixPlaceholders && hasPlaceholder) {
        console.log(`Fixed placeholders for "${project.title}"`);
        fixedCount++;
      } else {
        console.log(`Updated "${project.title}"`);
        updatedCount++;
      }
    }

    console.log(`\nMigration complete. Updated: ${updatedCount}, Fixed: ${fixedCount}, Skipped: ${skippedCount}`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
