"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMiscData = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const jumbotron_1 = __importDefault(require("../models/jumbotron"));
const faqs_1 = __importDefault(require("../models/faqs"));
const getMiscData = async (req, res, next) => {
    try {
        const [jumbotronData, faqsData] = await Promise.all([jumbotron_1.default.find(), faqs_1.default.find()]);
        res.status(200).json({ jumbotronData, faqsData });
    }
    catch (error) {
        (0, errorHandler_1.errorHandler)(error, next);
    }
};
exports.getMiscData = getMiscData;
//# sourceMappingURL=faqs.js.map