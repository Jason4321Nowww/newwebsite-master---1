const Location = require('../models/Location');

// GET /api/locations/cantons
// Returns distinct list of { kantonCode, kantonName }
const getCantons = async (req, res) => {
  try {
    const cantons = await Location.aggregate([
      { $group: { _id: '$kantonCode', kantonName: { $first: '$kantonName' } } },
      { $project: { _id: 0, kantonCode: '$_id', kantonName: 1 } },
      { $sort: { kantonName: 1 } },
    ]);
    res.json(cantons);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cantons', error: err.message });
  }
};

// GET /api/locations/bezirke/:kantonCode
// Returns distinct Bezirk names for a given Kanton
const getBezirke = async (req, res) => {
  try {
    const { kantonCode } = req.params;
    const bezirke = await Location.distinct('bezirk', { kantonCode });
    bezirke.sort();
    res.json(bezirke);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bezirke', error: err.message });
  }
};

// GET /api/locations/gemeinden/:kantonCode/:bezirk
// Returns distinct Gemeinde names for a given Kanton + Bezirk
const getGemeinden = async (req, res) => {
  try {
    const { kantonCode, bezirk } = req.params;
    const gemeinden = await Location.distinct('gemeinde', { kantonCode, bezirk });
    gemeinden.sort();
    res.json(gemeinden);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch gemeinden', error: err.message });
  }
};

module.exports = { getCantons, getBezirke, getGemeinden };
