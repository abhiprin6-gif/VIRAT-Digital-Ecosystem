const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const file = path.join(__dirname, '../../database/complaints.json');

function adminOnly(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Login required' });
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

function readData() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

router.get('/', adminOnly, (req, res) => {
  res.json({ complaints: readData() });
});

router.patch('/:id/status', adminOnly, (req, res) => {
  const allowed = ['Received', 'Under Review', 'Resolved', 'Rejected'];
  const { status } = req.body || {};

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const data = readData();
  const complaint = data.find(c => c.id === req.params.id);

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();

  const temp = file + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);

  res.json({ message: 'Complaint status updated', complaint });
});

module.exports = router;
