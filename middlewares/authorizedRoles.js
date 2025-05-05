const authorizedRoles = (...authorizedRoles) => {
  return (req, res, next) => {
    if (!req.user || !authorizedRoles.includes(req.user.role)) {
      res.status(401).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = authorizedRoles;
