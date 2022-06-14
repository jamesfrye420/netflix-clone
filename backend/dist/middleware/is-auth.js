"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, 'secret');
    }
    catch (err) {
        err.statusCode = 500;
        return (0, errorHandler_1.errorHandler)(err, next);
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        return (0, errorHandler_1.errorHandler)(error, next);
    }
    req.userId = decodedToken.userId;
    next();
};
exports.isAuth = isAuth;
//# sourceMappingURL=is-auth.js.map