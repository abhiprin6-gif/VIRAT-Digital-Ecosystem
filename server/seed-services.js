const connectDatabase = require("./database");

async function seed() {
  const { db, save } = await connectDatabase();

  const groups = {
    "Original Services": [
      "AI Services",
      "CSC Services",
      "Social Media",
      "INSTANT PAY",
      "Digital Tools",
      "VIRAT Labs"
    ],

    "VIRAT Modules": [
      "V Search",
      "VIRAT AI",
      "Government",
      "Career",
      "Education",
      "Drive",
      "Videos",
      "VIRAT CSC",
      "Business",
      "Innovation",
      "Research",
      "Technology",
      "Agriculture",
      "Health",
      "Local",
      "Connect",
      "Trust",
      "Memory",
      "Notifications",
      "Admin",
      "Developer Cloud",
      "Opportunity Engine",
      "VIRAT Citizen Problem Hub"
    ],

    "Productivity Services": [
      "V Maps",
      "V Mail",
      "V Docs",
      "V Sheets",
      "Slides",
      "Calendar",
      "V Meet",
      "Browser",
      "V Account",
      "V Photos",
      "V Translate",
      "V Voice",
      "V AI Studio",
      "News",
      "V Books & Research"
    ]
  };

  let added = 0;

  for (const [category, names] of Object.entries(groups)) {
    for (const name of names) {
      db.run(
        `INSERT OR IGNORE INTO services (name, category, status)
         VALUES (?, ?, 'planned')`,
        [name, category]
      );
      added++;
    }
  }

  save();

  const result = db.exec("SELECT COUNT(*) FROM services");
  console.log("VIRAT service catalog processed:", added);
  console.log("Total unique services in database:", result[0].values[0][0]);
  console.log("Database saved successfully.");
}

seed().catch(error => {
  console.error("Service setup failed:", error);
  process.exit(1);
});
