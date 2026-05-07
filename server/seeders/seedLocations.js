const Location = require('../models/Location');
const swissLocations = require('../data/swissLocations');

const seedLocations = async () => {
  try {
    const count = await Location.countDocuments();
    if (count > 0) {
      console.log(`[Seeder] Location data already present (${count} records) — skipping.`);
      return;
    }
    console.log('[Seeder] Inserting Swiss location data…');
    await Location.insertMany(swissLocations, { ordered: false });
    console.log(`[Seeder] Inserted ${swissLocations.length} location records.`);
  } catch (err) {
    console.error('[Seeder] Failed to seed locations:', err.message);
  }
};

module.exports = seedLocations;
