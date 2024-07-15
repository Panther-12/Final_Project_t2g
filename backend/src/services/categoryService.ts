import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoryService = {
  async createCategory(name: string) {
    return prisma.category.create({
      data: {
        name,
      },
    });
  },

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        events: true, // include events linked to this category
      },
    });
  },

  async getAllCategories() {
    return prisma.category.findMany({
      include: {
        events: true, // include events linked to each category
      },
    });
  },

  async updateCategory(id: string, name: string) {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },
};
