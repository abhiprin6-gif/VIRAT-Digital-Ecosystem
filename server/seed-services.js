const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const dbPath = path.join(__dirname, '../database/virat.db');

const allServices = [
    // --- 24 CORE MODULES ---
    { name: 'V Search', category: 'Core', description: 'Web Search Engine Gateway', official_link: 'https://www.google.com' },
    { name: 'VIRAT AI', category: 'Core', description: 'AI Assistant Portal', official_link: 'https://chat.openai.com' },
    { name: 'Government', category: 'Core', description: 'National Portal of India (Schemes & Services)', official_link: 'https://india.gov.in' },
    { name: 'Career', category: 'Core', description: 'National Career Service (NCS) Jobs Portal', official_link: 'https://www.ncs.gov.in' },
    { name: 'Education', category: 'Core', description: 'SWAYAM & Higher Education Portal', official_link: 'https://www.swayam.gov.in' },
    { name: 'Drive', category: 'Core', description: 'Cloud Storage Service', official_link: 'https://drive.google.com' },
    { name: 'Videos', category: 'Core', description: 'Video Streaming Gateway', official_link: 'https://www.youtube.com' },
    { name: 'INSTANT PAY', category: 'Core', description: 'NPCI Payment Gateway Info', official_link: 'https://www.npci.org.in' },
    { name: 'VIRAT CSC', category: 'Core', description: 'Common Service Centre Finder', official_link: 'https://csc.gov.in' },
    { name: 'Business', category: 'Core', description: 'MSME Business Portal', official_link: 'https://www.msme.gov.in' },
    { name: 'Innovation', category: 'Core', description: 'Startup India Portal', official_link: 'https://www.startupindia.gov.in' },
    { name: 'Research', category: 'Core', description: 'Shodhganga Indian Research Portal', official_link: 'https://shodhganga.inflibnet.ac.in' },
    { name: 'Technology', category: 'Core', description: 'MeitY Government Tech Portal', official_link: 'https://www.meity.gov.in' },
    { name: 'Agriculture', category: 'Core', description: 'PM Kisan & Agmarknet Portal', official_link: 'https://pmkisan.gov.in' },
    { name: 'Health', category: 'Core', description: 'Ayushman Bharat Digital Health Mission', official_link: 'https://abdm.gov.in' },
    { name: 'Local', category: 'Core', description: 'ePanchayat Local Directory', official_link: 'https://panchayat.gov.in' },
    { name: 'Connect', category: 'Core', description: 'MyGov India Citizen Engagement', official_link: 'https://mygov.in' },
    { name: 'Trust', category: 'Core', description: 'National Consumer Helpline Portal', official_link: 'https://consumerhelpline.gov.in' },
    { name: 'Memory', category: 'Core', description: 'VIRAT Secure Vault Service', official_link: '/service.html?id=19' },
    { name: 'Notifications', category: 'Core', description: 'Official Announcements Feed', official_link: 'https://mygov.in' },
    { name: 'Admin', category: 'Core', description: 'VIRAT System Dashboard', official_link: '/admin.html' },
    { name: 'Developer Cloud', category: 'Core', description: 'GitHub Open Source Platform', official_link: 'https://github.com' },
    { name: 'Opportunity Engine', category: 'Core', description: 'Apprenticeship Opportunities Portal', official_link: 'https://www.apprenticeshipindia.gov.in' },
    { name: 'VIRAT Citizen Problem Hub', category: 'Core', description: 'CPGRAMS Central Grievance Portal', official_link: 'https://pgportal.gov.in' },

    // --- 15 PRODUCTIVITY TOOLS ---
    { name: 'V Maps', category: 'Productivity', description: 'OpenStreetMap Navigation & Mapping', official_link: 'https://www.openstreetmap.org' },
    { name: 'V Mail', category: 'Productivity', description: 'Email Communication Hub', official_link: 'https://mail.google.com' },
    { name: 'V Docs', category: 'Productivity', description: 'Document Editor Portal', official_link: 'https://docs.google.com' },
    { name: 'V Sheets', category: 'Productivity', description: 'Spreadsheet Workspace', official_link: 'https://sheets.google.com' },
    { name: 'Slides', category: 'Productivity', description: 'Presentation Builder', official_link: 'https://slides.google.com' },
    { name: 'Calendar', category: 'Productivity', description: 'Event Scheduler & Calendar', official_link: 'https://calendar.google.com' },
    { name: 'V Meet', category: 'Productivity', description: 'Video Conferencing Portal', official_link: 'https://meet.google.com' },
    { name: 'Browser', category: 'Productivity', description: 'Web Exploration Gateway', official_link: 'https://www.google.com' },
    { name: 'Account', category: 'Productivity', description: 'VIRAT User Account Settings', official_link: '/admin.html' },
    { name: 'Photos', category: 'Productivity', description: 'Photo Gallery Storage', official_link: 'https://photos.google.com' },
    { name: 'V Translate', category: 'Productivity', description: 'Multi-language Translation Tool', official_link: 'https://translate.google.com' },
    { name: 'Voice', category: 'Productivity', description: 'Voice Assistant Portal', official_link: 'https://assistant.google.com' },
    { name: 'V AI Studio', category: 'Productivity', description: 'Google AI Studio Workspace', official_link: 'https://aistudio.google.com' },
    { name: 'News', category: 'Productivity', description: 'DD News Official Channel', official_link: 'https://ddnews.gov.in' },
    { name: 'Books & Research', category: 'Productivity', description: 'National Digital Library of India', official_link: 'https://ndl.iitkgp.ac.in' }
];

async function seed() {
    const SQL = await initSqlJs();
    let db;
    if (fs.existsSync(dbPath)) {
        const filebuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(filebuffer);
    } else {
        db = new SQL.Database();
    }

    db.run(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        category TEXT,
        description TEXT,
        official_link TEXT
    );`);

    db.run("DELETE FROM services;");

    const stmt = db.prepare("INSERT INTO services (name, category, description, official_link) VALUES (?, ?, ?, ?);");
    allServices.forEach(s => {
        stmt.run([s.name, s.category, s.description, s.official_link]);
    });
    stmt.free();

    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    console.log("Successfully linked all 39 services to their official websites!");
}

seed().catch(err => console.error("Seeding Error:", err));
