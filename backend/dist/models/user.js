"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    watchLater: [
        {
            movies: String,
            series: String,
        },
    ],
});
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.js.map