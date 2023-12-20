const { BadRequestError, UnauthenticatedError } = require("../errors");

const chechPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError("Not authorized to access this resources");
};

module.exports = chechPermissions;
