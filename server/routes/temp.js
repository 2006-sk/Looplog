const express = require('express');
const Log = require('../models/CleanLog.js');
console.log('💥 Log typeof:', typeof Log);

const router = express.Router();

/**
 * POST /api/logs
 * Create a new log entry
 */
router.post('/', async (req, res) => {
  try {
    const { type, message, metadata } = req.body;
    const log = new Log({ type, message, metadata });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/logs
 * Get the latest 100 logs
 * Optional: filter by ?type=error/info/debug/event
 */
router.get('/', async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const logs = await Log.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/logs/:id
 * Update an existing log by ID
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedLog = await Log.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedLog) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json(updatedLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /api/logs/:id
 * Delete a log by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedLog = await Log.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
