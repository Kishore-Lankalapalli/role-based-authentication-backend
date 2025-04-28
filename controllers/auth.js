const yup = require("yup");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const dashboardPermissionSchema = yup.object().shape({
  read: yup.boolean().required().default(false),
});

const reportsSchema = yup.object().shape({
  read: yup.boolean().required().default(false),
});

const productsSchema = yup.object().shape({
  create: yup.boolean().required().default(false),
  read: yup.boolean().required().default(false),
  update: yup.boolean().required().default(false),
  delete: yup.boolean().required().default(false),
});

const permissionSchema = yup.object().shape({
  Dashboard: dashboardPermissionSchema.default({}),
  Reports: reportsSchema.default({}),
  Products: productsSchema.default({}),
});

const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(["ADMIN", "EDITOR", "VIEWER", "OTHER"], "Invalid role")
    .required("Role is required"),
  permissions: permissionSchema.default({}),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

exports.createNewUser = async (req, res, next) => {
  console.log("func called");

  console.log(req.body, "request object");

  try {
    // const user = req.user;
    // if (!user.role !== "ADMIN") {
    //   res.status(401).json({
    //     code: 401,
    //     message: "You are not authorized",
    //   });
    // }

    const validateUser = await userSchema.validate(req.body, {
      abortEarly: false,
    });

    const { name, email, password, role, permissions } = req.body;

    const hashedPassword = await bcrypt.hash(password, 9);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      permissions: permissions,
    });

    await newUser.save();

    res.status(200).json({
      code: 200,
      message: "User created successfully",
    });
  } catch (e) {
    console.log(e, "error");
    if (e?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: e.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body, {
      abortEarly: false,
    });

    const { email, password } = req.body;

    console.log(email, password, "email password");

    const userFound = await User.findOne({ email: email });

    console.log(userFound, "user found");

    if (!userFound) {
      return res.status(400).json({
        code: 400,
        message: "User not found",
      });
    }

    const payload = {
      userId: userFound._id,
      email: userFound.email,
      role: userFound.role,
    };

    const isPassword = await bcrypt.compare(password, userFound.password);

    if (!isPassword) {
      return res.status(400).json({
        code: 400,
        message: "Invalid password",
      });
    }

    // Set session
    req.session.isLoggedIn = true;
    req.session.userId = userFound._id;

    // Save session explicitly if needed (especially for redirects)
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          message: "Session save failed",
        });
      }

      const jwtToken = jwt.sign(payload, "ROLE-BASED-AUTHENTICATION");

      return res.status(200).json({
        message: "Login Successfully",
        code: 200,
        token: jwtToken,
        user: {
          id: userFound._id,
          name: userFound.name,
          email: userFound.email,
          role: userFound.role,
        },
      });
    });
  } catch (e) {
    console.log(e, "errors");
    if (e?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: e.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message,
    });
  }
};

exports.getUsers = async (req, res, next) => {
  console.log("users fetching");
  try {
    const user = req.user;
    if (!user.role !== "ADMIN") {
      res.status(401).json({
        code: 401,
        message: "You are not authorized",
      });
    }

    const users = await User.find({});

    return res.status(200).json({
      message: "Users fetched successfully",
      code: 200,
      data: users,
    });
  } catch (e) {
    console.log(e, "errors");
    if (e?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: e.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message,
    });
  }
};

exports.fetchUserDetails = async (req, res, next) => {
  try {
    const userId = req.user._id;

    console.log(userId, "user id received");

    const userDetails = await User.findOne({
      _id: userId,
    });

    res.status(200).json({
      message: "User fetched successfully",
      data: userDetails,
    });
  } catch (e) {
    if (e?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: e.errors,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: e.message,
    });
  }
};
