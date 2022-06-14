"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.putSignup = exports.postSignin = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../utils/errorHandler");
const user_1 = __importDefault(require("../models/user"));
const hostURL = 'http://localhost:8080/';
const postSignin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        let loadedUser;
        loadedUser = await user_1.default.findOne({ email: email });
        if (!loadedUser) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        const isEqual = await bcryptjs_1.default.compare(password, loadedUser.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
        }, 'secret', { expiresIn: '60d' });
        return res
            .status(200)
            .json({ message: 'login successful', token: token, userId: loadedUser._id.toString(), User: loadedUser });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, next);
    }
};
exports.postSignin = postSignin;
const putSignup = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const firstName = req.body.firstName;
        const email = req.body.email;
        const password = req.body.password;
        const photoURL = req.body.photoURL;
        const existingUser = await user_1.default.findOne({ email: email });
        if (existingUser) {
            const error = new Error('email already exists');
            error.statusCode = 422;
            throw error;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({
            firstName,
            email,
            password: hashedPassword,
            photoURL: `${hostURL}images/users/${photoURL}.png`,
        });
        const savedUser = await user.save();
        if (!savedUser) {
            const error = new Error('A user with this email could not be created.');
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            email: savedUser.email,
            userId: savedUser._id.toString(),
        }, 'secret', { expiresIn: '60d' });
        return res.status(201).json({ message: 'user created', token, userId: savedUser._id.toString(), User: savedUser });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, next);
    }
};
exports.putSignup = putSignup;
const getUser = async (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'not authorized' });
    }
    try {
        const user = await user_1.default.findById(req.userId);
        if (!user_1.default) {
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Is Authenticted', userId: req.userId, User: user });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, next);
    }
};
exports.getUser = getUser;
//# sourceMappingURL=auth.js.map