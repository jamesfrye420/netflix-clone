"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_auth_1 = require("../middleware/is-auth");
const auth_1 = require("../controller/auth");
const router = (0, express_1.Router)();
router.post('/signin', [(0, express_validator_1.body)('email').isEmail().withMessage('enter valid email').trim(), (0, express_validator_1.body)('password').trim().notEmpty()], auth_1.postSignin);
router.put('/signup', [
    (0, express_validator_1.body)('email').isEmail().withMessage('enter valid email').trim(),
    (0, express_validator_1.body)('password').trim().notEmpty(),
    (0, express_validator_1.body)('firstName').trim().notEmpty(),
], auth_1.putSignup);
router.get('/user', is_auth_1.isAuth, auth_1.getUser);
exports.default = router;
//# sourceMappingURL=auth.js.map