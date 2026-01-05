const Banner = require('../models/InfoBanner');

// @desc    Create a new banner
// @route   POST /api/banner
 const createBanner = async (req, res) => {
  try {
    const { statement, link, isActive } = req.body;

    // Optional: Deactivate other banners if only one should be active
    if (isActive) {
      await Banner.updateMany({}, { isActive: false });
    }

    const banner = await Banner.create({ statement, link, isActive });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all banners (or filter only active one if needed)
// @route   GET /api/banner
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a banner
// @route   PUT /api/banner/:id
const updateBanner = async (req, res) => {
  try {
    const { statement, link, isActive } = req.body;

    if (isActive) {
      if (isActive) {
  await Banner.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
}

    }

    const updated = await Banner.findByIdAndUpdate(
      req.params.id,
      { statement, link, isActive },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Banner not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banner/:id
const deleteBanner = async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Banner not found' });
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {createBanner, getBanners, updateBanner, deleteBanner}