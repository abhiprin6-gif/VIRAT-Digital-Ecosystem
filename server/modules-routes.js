const express = require('express');
const router = express.Router();

// 1. Government & Career Verified Directory API
router.get('/api/v1/gov-career', (req, res) => {
    res.json({
        status: 'success',
        government_schemes: [
            { id: 1, title: 'PM Kisan Samman Nidhi', link: 'https://pmkisan.gov.in', status: 'Official' },
            { id: 2, title: 'Digital India Services Portal', link: 'https://digitalindia.gov.in', status: 'Official' },
            { id: 3, title: 'National Scholarship Portal', link: 'https://scholarships.gov.in', status: 'Official' }
        ],
        career_updates: [
            { id: 1, title: 'SSC Official Portal', link: 'https://ssc.gov.in', category: 'Central Govt' },
            { id: 2, title: 'NCS Job Portal', link: 'https://www.ncs.gov.in', category: 'Employment' },
            { id: 3, title: 'Apprenticeship India', link: 'https://www.apprenticeshipindia.gov.in', category: 'Skill Training' }
        ]
    });
});

// 2. Citizen Problem Hub Draft Generator API
router.post('/api/v1/citizen-hub/draft', (req, res) => {
    const { category, subject, description, department } = req.body;
    const trackingId = 'VIRAT-CPH-' + Date.now().toString().slice(-6);
    res.json({
        status: 'success',
        trackingId: trackingId,
        draft: `To,\nThe Nodal Officer,\nDepartment of ${department || 'Public Grievances'}\n\nSubject: ${subject || 'Grievance Application'}\n\nRespected Sir/Madam,\n${description || 'I would like to draw your attention towards the issue.'}\n\nDate: ${new Date().toLocaleDateString('en-IN')}\nTracking Reference: ${trackingId}`,
        official_portal: 'https://pgportal.gov.in'
    });
});

// 3. INSTANT PAY Demo Simulation API
router.post('/api/v1/instant-pay/demo', (req, res) => {
    const { amount, receiver } = req.body;
    res.json({
        status: 'demo_success',
        mode: 'SIMULATION_ONLY',
        txnId: 'VIRAT-PAY-' + Math.floor(100000 + Math.random() * 900000),
        amount: amount || 0,
        receiver: receiver || 'Demo Merchant',
        timestamp: new Date().toISOString(),
        note: 'This is a safe sandbox simulation. No real money was moved.'
    });
});

module.exports = router;
