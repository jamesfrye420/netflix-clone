"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const faq_1 = __importDefault(require("./routes/faq"));
const auth_1 = __importDefault(require("./routes/auth"));
const content_1 = __importDefault(require("./routes/content"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '..', 'images')));
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(faq_1.default);
app.use('/auth', auth_1.default);
app.use('/content', content_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    app.listen(8080, () => {
        console.log('Server started on localhost 8080');
    });
})
    .catch((error) => console.log(error));
//# sourceMappingURL=index.js.map