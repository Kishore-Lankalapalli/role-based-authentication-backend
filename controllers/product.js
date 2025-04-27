const yup = require("yup");
const Product = require("../models/product");

const productSchema = yup.object({
  title: yup.string().required("Title is required"),
  price: yup.number().required("Price is required"),
  description: yup.string().required("Description is required"),
});

exports.addProduct = async (req, res, next) => {
  try {
    await productSchema.validate(req.body, {
      abortEarly: false,
    });

    const { title, price, description } = req.body;

    const newProduct = await Product.create({
      title,
      price,
      description,
    });

    newProduct.save();

    res.status(200).json({
      code: 200,
      message: "Product created successfully",
    });
  } catch (e) {
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
      error: error.message,
    });
  }
};

exports.fetchProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      code: 200,
      data: products,
      message: "Products Fetched successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.fetchSpecificProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(id, "id received");

    if (!id) {
      res.status(400).json({
        code: 400,
        message: "Invalid id",
      });
    }

  const product = await Product.findById(id)

    res.status(200).json({
      code: 200,
      data:product,
      message: "Product fetched successfully",
    });
  } catch (e) {
    console.log(e, "error");
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};



exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(id, "id received");

    if (!id) {
      res.status(400).json({
        code: 400,
        message: "Invalid id",
      });
    }

    const { title, price, description } = req.body;

    const product = await Product.findByIdAndUpdate(id, {
      title,
      price,
      description,
    }).exec();

    res.status(200).json({
      code: 200,
      message: "Product updated successfully",
    });
  } catch (e) {
    console.log(e, "error");
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        code: 400,
        message: "Invalid id",
      });
    }

    const productFound = await Product.findByIdAndDelete(id);

    res.status(200).json({
      code: 200,
      message: "Product deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
