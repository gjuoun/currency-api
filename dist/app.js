"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load .env environment variables
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
const express_1 = __importDefault(require("express"));
const exchange_1 = require("./exchange");
const app = express_1.default();
// query: from, to, amount
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Get request from ", req.ip);
    if (req.query.from) {
        const { amount, from, to } = req.query;
        const result = yield exchange_1.convert(+amount, from, to);
        return res.send({ success: true, data: result });
    }
    res.send({
        success: false,
        message: "no query parameter is provided, need amount, from, to",
    });
}));
app.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield exchange_1.getAll());
}));
const port = process.env.PORT || 6001;
app.listen(port, () => {
    console.log(`ExchangeAPI is running on ${port}`);
    // fetch rate every 4 hours
    exchange_1.updateLatestRate();
});
//# sourceMappingURL=app.js.map