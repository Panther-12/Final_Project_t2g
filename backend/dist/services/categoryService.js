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
exports.categoryService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.categoryService = {
    createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.create({
                data: {
                    name,
                },
            });
        });
    },
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.findUnique({
                where: { id },
                include: {
                    events: true, // include events linked to this category
                },
            });
        });
    },
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.findMany({
                include: {
                    events: true, // include events linked to each category
                },
            });
        });
    },
    updateCategory(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.update({
                where: { id },
                data: { name },
            });
        });
    },
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.category.delete({
                where: { id },
            });
        });
    },
};
