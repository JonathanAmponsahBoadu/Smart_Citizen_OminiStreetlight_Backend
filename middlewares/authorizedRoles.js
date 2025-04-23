const authorizedRoles = (...authorizedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.includes(authorizedRoles)) {
      res.status(401).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = authorizedRoles;
