const mongoose = require("mongoose");

const { Schema } = mongoose;

const dashboardPermissionSchema = new Schema({
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const reportsSchema = new Schema({
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const productsSchema = new Schema({
  create: {
    type: Boolean,
    required: true,
    default: false,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  update: {
    type: Boolean,
    required: true,
    default: false,
  },
  delete: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const PermissionSchema = new Schema({
  Dashboard: {
    type: dashboardPermissionSchema,
    default: () => ({}),
  },
  Reports: {
    type: reportsSchema,
    default: () => ({}),
  },
  Products: {
    type: productsSchema,
    default: () => ({}),
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["ADMIN", "EDITOR", "VIEWER", "OTHER"],
  },
  permissions: {
    type: PermissionSchema,
    default: () => ({}),
  },
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;
