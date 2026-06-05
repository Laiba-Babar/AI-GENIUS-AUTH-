const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden. Only ${roles.join(' or ')} can access this resource.`
      });
    }
    next();
  };
};

module.exports = restrictTo;