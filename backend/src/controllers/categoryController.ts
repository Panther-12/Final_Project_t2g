import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService';

export const categoryController = {
  async createCategory(req: Request, res: Response) {
    const { name } = req.body;

    try {
      const category = await categoryService.createCategory(name);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  },

  async getCategoryById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const category = await categoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  },

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const updatedCategory = await categoryService.updateCategory(id, name);
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  },

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await categoryService.deleteCategory(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  },
};
