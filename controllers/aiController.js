// GET /api/ai/free-model — Sab logged-in users
exports.freeModel = (req, res) => {
  res.status(200).json({
    message: `Free AI Model accessed successfully`,
    user: req.user.email,
    role: req.user.role
  });
};

// POST /api/ai/premium-model — Sirf Premium_User aur Admin
exports.premiumModel = (req, res) => {
  res.status(200).json({
    message: `Premium AI Model accessed successfully`,
    user: req.user.email,
    role: req.user.role
  });
};

// DELETE /api/ai/purge-cache — Sirf Admin
exports.purgeCache = (req, res) => {
  res.status(200).json({
    message: `Cache purged successfully by Admin`,
    user: req.user.email,
    role: req.user.role
  });
};