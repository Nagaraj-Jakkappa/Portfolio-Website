const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/certificates
 * @desc    Get all certificates (Public)
 */
router.get('/', async (req, res) => {
    try {
        // Added .sort to show newest certificates first
        const certificates = await Certificate.find().sort({ createdAt: -1 });
        res.json(certificates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   POST /api/certificates
 * @desc    Add a new certificate (Admin Only)
 */
router.post('/', protect, async (req, res) => {
    try {
        const { title, organization, date, link, description } = req.body;

        if (!title || !organization) {
            return res.status(400).json({ error: 'Title and Organization are required' });
        }

        const newCertificate = await Certificate.create({
            title,
            organization,
            date,
            link,
            description
        });

        res.status(201).json(newCertificate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route   DELETE /api/certificates/:id
 * @desc    Delete a certificate (Admin Only)
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const cert = await Certificate.findById(req.params.id);
        if (!cert) {
            return res.status(404).json({ error: 'Certificate not found' });
        }

        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certificate removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;