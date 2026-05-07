/**
 * Role migration: insert Superadmin (0), shift old roles.
 *
 * Old → New:
 *   0 (Admin)              → 3 (Admin)
 *   1 (Vorsitzende)        → 1 (unchanged)
 *   2 (Vorstand)           → 2 (unchanged)
 *   3 (Regionalverwaltung) → 4
 *   4 (Lokalverwaltung)    → 5
 *   5 (Vollmitglied)       → 6
 *   6 (Regulaermitglied)   → 7
 *   7 (Oeffentlich)        → 8
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB:', process.env.MONGO_URI);

  const User  = mongoose.connection.collection('users');
  const Admin = mongoose.connection.collection('admins');

  // ── Users ────────────────────────────────────────────────────
  // Process highest first to avoid collisions (7→8 before 6→7, etc.)
  const userShifts = [
    { from: 7, to: 8 },
    { from: 6, to: 7 },
    { from: 5, to: 6 },
    { from: 4, to: 5 },
    { from: 3, to: 4 },
    { from: 0, to: 3 },
    // 1 and 2 stay the same
  ];

  for (const { from, to } of userShifts) {
    const result = await User.updateMany({ roleLevel: from }, { $set: { roleLevel: to } });
    console.log(`Users  roleLevel ${from} → ${to}: ${result.modifiedCount} updated`);
  }

  // ── Admins ───────────────────────────────────────────────────
  const adminShifts = [
    { from: 7, to: 8 },
    { from: 6, to: 7 },
    { from: 5, to: 6 },
    { from: 4, to: 5 },
    { from: 3, to: 4 },
    { from: 0, to: 3 },
  ];

  for (const { from, to } of adminShifts) {
    const result = await Admin.updateMany({ roleLevel: from }, { $set: { roleLevel: to } });
    console.log(`Admins roleLevel ${from} → ${to}: ${result.modifiedCount} updated`);
  }

  console.log('\nMigration complete.');
  console.log('Remember to manually set your superadmin account:');
  console.log('  db.admins.updateOne({ email: "your@email.com" }, { $set: { roleLevel: 0, isActive: true } })');

  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
