// Factory: authorize('admin') or authorize('admin', 'user')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role}' is not authorized for this action.`,
      });
    }
    next();
  };
};

module.exports = { authorize };
