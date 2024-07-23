"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const categoryService_1 = require("../services/categoryService");
exports.categoryController = {
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            try {
                const category = yield categoryService_1.categoryService.createCategory(name);
                res.status(201).json(category);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create category' });
            }
        });
    },
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const category = yield categoryService_1.categoryService.getCategoryById(id);
                if (!category) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                res.json(category);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch category' });
            }
        });
    },
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryService_1.categoryService.getAllCategories();
                res.json(categories);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch categories' });
            }
        });
    },
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name } = req.body;
            try {
                const updatedCategory = yield categoryService_1.categoryService.updateCategory(id, name);
                res.json(updatedCategory);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update category' });
            }
        });
    },
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield categoryService_1.categoryService.deleteCategory(id);
                res.json({ message: 'Category deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete category' });
            }
        });
    },
};
