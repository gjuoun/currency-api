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
/* --------------------------------- Routes --------------------------------- */
app.use((req, res, next) => {
    console.log("Get request from ip - ", req.ip);
    next();
});
// query: from, to, amount
app.get("/convert", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // ?? is dealing with null/undefined to set fallback value
    if (req.query.from) {
        const from = (_a = req.query.from) !== null && _a !== void 0 ? _a : "CAD";
        const to = (_b = req.query.to) !== null && _b !== void 0 ? _b : "CNY";
        const amount = parseInt(req.query.amount) || 1;
        const result = yield exchange_1.convert(amount, from, to);
        return res.send({ success: true, data: result });
    }
    res.send({
        success: false,
        message: "no query parameter is provided, need amount, from, to",
    });
}));
app.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        success: true,
        data: yield exchange_1.getAll(),
    });
}));
/* -------------------------------------------------------------------------- */
/*                  Start server and fetch rate every 4 hours                 */
/* -------------------------------------------------------------------------- */
const port = process.env.PORT || 6001;
app.listen(port, () => {
    console.log(`ExchangeAPI is running on ${port}`);
    // fetch rate every 4 hours
    exchange_1.updateLatestRate();
});
//# sourceMappingURL=app.js.map