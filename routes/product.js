const express = require("express");
const {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchSpecificProduct,
} = require("../controllers/product");
const {
  isAuthenticated,
  isPermitted,
} = require("../middlewares/isAuthenticated");
const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isPermitted(req, res, next, { module: "Products", permission: "read" }),
  fetchProducts
);
router.post(
  "/",
  isAuthenticated,
  (req, res, next) =>
    isPermitted(req, res, next, { module: "Products", permission: "create" }),
  addProduct
);

router.get(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isPermitted(req, res, next, { module: "Products", permission: "read" }),
  fetchSpecificProduct
);

router.put(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isPermitted(req, res, next, { module: "Products", permission: "update" }),
  updateProduct
);
router.delete(
  "/:id",
  isAuthenticated,
  (req, res, next) =>
    isPermitted(req, res, next, { module: "Products", permission: "delete" }),
  deleteProduct
);

module.exports = router;
