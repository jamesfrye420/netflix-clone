"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const jumbotronSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subTitle: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, required: true },
    direction: { type: String, required: true },
});
exports.default = mongoose_1.default.model('jumbo', jumbotronSchema);
//# sourceMappingURL=jumbotron.js.map