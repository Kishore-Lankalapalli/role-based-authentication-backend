const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticated = async (req, res, next) => {
  try {
    console.log(req, "headers");
    const requestHeaders = req?.headers?.authorization;

    console.log(requestHeaders, "request headers");

    const token = requestHeaders?.split(" ")[1];

    console.log(token, "token");

    if (!token) {
      res.status(401).json({
        code: 401,
        message: "Invalid token",
      });
    }

    const decodeToken = jwt.verify(token, "ROLE-BASED-AUTHENTICATION");

    console.log(decodeToken, "decoded token");

    const userId = decodeToken?.userId;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or session expired",
      });
    }
    const user = await User.findById({ _id: userId });

    console.log(user, "user");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    console.log(user, "user");
    next();
  } catch (e) {
    res.status(500).json({
      message: e?.message,
    });
  }
};

exports.isPermitted = async (req, res, next, permissionObject) => {
  try {
    const user = req.user;

    if (user?.role === "ADMIN") {
      next();
    } else {
      console.log("else block");
      const permissions = user?.permissions;
      console.log(permissions, "87");

      const { module, permission } = permissionObject;
      console.log(module, permission, "2");

      console.log(permissions?.module?.permission, "909");

      if (!permissions?.[module]?.[permission]) {
        res.status(401).json({
          code: 401,
          message: "You are not authorized",
        });
      } else {
        next();
      }

      console.log(user, "user");
    }
  } catch (e) {
    console.log(e, "error");
    res.status(500).json({
      message: e?.message,
    });
  }
};
