/**
 * certificates.js — MERGED
 * Preserved: GET, POST, DELETE with { title, organization, date, link, description } fields
 * Added: PUT /:id (edit), GET /:id (single), ObjectId validation, input validation
 */
const express = require('express');
const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/auth');
const router = express.Router();

function validateCert(body) {
    const errors = {};
    if (!body.title?.trim()) errors.title = 'Title is required';
    if (!body.organization?.trim()) errors.organization = 'Organization is required';
    return errors;
}

// GET /api/certificates  (public)
router.get('/', async (req, res) => {
    try {
        const certs = await Certificate.find().sort({ createdAt: -1 }).lean();
        res.json(certs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/certificates/:id  (public)
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ error: 'Invalid certificate ID' });
        const cert = await Certificate.findById(req.params.id).lean();
        if (!cert) return res.status(404).json({ error: 'Certificate not found' });
        res.json(cert);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/certificates  (protected)
router.post('/', protect, async (req, res) => {
    try {
        const errors = validateCert(req.body);
        if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors });
        const cert = await Certificate.create({
            title: req.body.title.trim(),
            organization: req.body.organization.trim(),
            date: req.body.date || null,
            link: req.body.link?.trim() || '',
            description: req.body.description?.trim() || '',
        });
        res.status(201).json(cert);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/certificates/:id  (protected) — NEW
router.put('/:id', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ error: 'Invalid certificate ID' });
        const errors = validateCert(req.body);
        if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors });
        const updated = await Certificate.findByIdAndUpdate(req.params.id, {
            title: req.body.title.trim(),
            organization: req.body.organization.trim(),
            date: req.body.date || null,
            link: req.body.link?.trim() || '',
            description: req.body.description?.trim() || '',
        }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Certificate not found' });
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/certificates/:id  (protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ error: 'Invalid certificate ID' });
        const cert = await Certificate.findByIdAndDelete(req.params.id);
        if (!cert) return res.status(404).json({ error: 'Certificate not found' });
        res.json({ success: true, message: 'Certificate removed' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
