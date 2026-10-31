const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const file = path.join(__dirname, '../../database/complaints.json');

function readComplaints() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function saveComplaints(data) {
  const temp = file + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, file);
}

function loggedIn(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Please login first' });
  }
  next();
}

router.post('/', loggedIn, (req, res) => {
  const { category, subject, description } = req.body || {};

  if (!category || !subject || !description ||
      subject.length > 150 || description.length > 5000) {
    return res.status(400).json({ error: 'Valid category, subject and description are required' });
  }

  const complaints = readComplaints();
  const complaint = {
    id: 'VIRAT-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
    userId: req.session.user.id,
    category: String(category).slice(0, 80),
    subject: String(subject).trim(),
    description: String(description).trim(),
    status: 'Received',
    createdAt: new Date().toISOString()
  };

  complaints.push(complaint);
  saveComplaints(complaints);
  res.status(201).json({ message: 'Complaint saved', complaint });
});

router.get('/', loggedIn, (req, res) => {
  const userId = req.session.user.id;
  const complaints = readComplaints().filter(c => c.userId === userId);
  res.json({ complaints });
});

module.exports = router;
