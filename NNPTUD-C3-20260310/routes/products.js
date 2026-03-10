var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')

/* GET all products (Read all khong can truy van). */
router.get('/', async function (req, res, next) {
  try {
    let result = await productModel.find({ isDeleted: false });
    res.status(200).send({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

/* GET one product by ID */
router.get('/:id', async function (req, res, next) {
  try {
    let result = await productModel.findById(req.params.id);
    if (!result) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    res.status(200).send({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

/* POST: Create a new product */
router.post('/', async function (req, res, next) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: req.body.slug,
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      category: req.body.category
    });

    let result = await newProduct.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

/* PUT: Update a product */
router.put('/:id', async function (req, res, next) {
  try {
    let result = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      data: result
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

/* DELETE: Soft delete a product */
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await productModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!result) {
      return res.status(404).send({ success: false, message: "Product not found" });
    }
    res.status(200).send({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
