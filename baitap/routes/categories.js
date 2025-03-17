var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category'); // Import schema

//Lấy danh sách danh mục
router.get('/', async function(req, res, next) {
  try {
    let categories = await categorySchema.find({ isDeleted: { $ne: true } }); // Lọc bỏ danh mục đã xóa
    res.status(200).send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

//Lấy danh mục theo ID
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục"
      });
    }
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

//Thêm danh mục mới
router.post('/', async function(req, res, next) {
  try {
    let { name, description } = req.body;
    if (!name) {
      return res.status(400).send({ success: false, message: "Tên danh mục là bắt buộc" });
    }

    let newCategory = new categorySchema({
      name,
      description: description || ""
    });

    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

//Cập nhật danh mục
router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục"
      });
    }

    let { name, description } = req.body;
    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

//Xóa mềm danh mục
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục"
      });
    }

    category.isDeleted = true;
    await category.save();
    res.status(200).send({
      success: true,
      message: "Danh mục đã được xóa mềm",
      data: category
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
