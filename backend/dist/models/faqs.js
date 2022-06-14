"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const faqsSchema = new Schema({
    header: {
        type: String,
        required: true,
    },
    body: { type: String, required: true },
});
exports.default = mongoose_1.default.model('faq', faqsSchema);
//# sourceMappingURL=faqs.js.map