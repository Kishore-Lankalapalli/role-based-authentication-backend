const jwt = require("jsonwebtoken");
const User = require("../models/user");
const moment = require("moment");

exports.isAuthenticated = async (req, res, next) => {
  try {
       // Check if the session exists
       if (!req.session) {
        console.log("No session found.");
        return res.status(401).json({
          success: false,
          code: 401,
          message: "Session expired or invalid. Please login again.",
          expired: true,
        });
      }
  
      const sessionExpirationTime = req.session.cookie._expires;
      console.log("Session Expiration Time:", sessionExpirationTime);
  
      const currentTime = moment();
      const expirationTimeMoment = moment(sessionExpirationTime);

      console.log(moment(sessionExpirationTime).format("DD-MM-YYYY hh:mm:ss A"))
  
      if (expirationTimeMoment.isBefore(currentTime)) {
        console.log("Session expired.");
        
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
          }
        });
  
        return res.status(401).json({
          success: false,
          code: 401,
          message: "Session expired or invalid. Please login again.",
          expired: true,
        });
      }

    const requestHeaders = req?.headers?.authorization;

    const token = requestHeaders?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        code: 401,
        message: "Invalid token",
      });
    }

    const decodeToken = jwt.verify(token, "ROLE-BASED-AUTHENTICATION");

    const userId = decodeToken?.userId;
    console.log(userId);
    if (!userId) {
      req.session.destroy((err) => {
        if (err) console.error("Error destroying session:", err);
      });
      return res.status(401).json({
        success: false,
        message: "Invalid token or session expired",
      });
    }
    const user = await User.findById({ _id: userId });

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
     
      const permissions = user?.permissions;
  

      const { module, permission } = permissionObject;
      

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
    res.status(500).json({
      message: e?.message,
    });
  }
};
