"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faqs_1 = require("../controller/faqs");
const router = (0, express_1.Router)();
router.post('/faqs', faqs_1.postFaq);
exports.default = router;
//# sourceMappingURL=addfaq.js.map