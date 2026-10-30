module.exports = function setupAdmin(db) {
  const columns = db.exec("PRAGMA table_info(users)");
  const names = columns.length
    ? columns[0].values.map(row => row[1])
    : [];

  if (!names.includes("role")) {
    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
  }
};
