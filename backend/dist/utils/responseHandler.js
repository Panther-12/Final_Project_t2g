"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, error) => {
    res.status(500).json({
        success: false,
        message: error.message,
    });
};
exports.errorResponse = errorResponse;
