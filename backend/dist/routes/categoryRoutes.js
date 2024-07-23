"use strict";
// routes/categoryRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.isAdmin, categoryController_1.categoryController.createCategory);
router.get('/', categoryController_1.categoryController.getAllCategories);
router.get('/:id', categoryController_1.categoryController.getCategoryById);
router.put('/:id', auth_1.isAdmin, categoryController_1.categoryController.updateCategory);
router.delete('/:id', auth_1.isAdmin, categoryController_1.categoryController.deleteCategory);
exports.default = router;
