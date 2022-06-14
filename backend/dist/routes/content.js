"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_1 = require("../controller/content");
const router = (0, express_1.Router)();
router.get('/configuration', content_1.getTMDBConfig);
router.get('/:slug', content_1.getBrowseContent);
exports.default = router;
//# sourceMappingURL=content.js.map