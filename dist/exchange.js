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
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const lowdb_1 = __importDefault(require("lowdb"));
const FileAsync_1 = __importDefault(require("lowdb/adapters/FileAsync"));
const currencies_1 = __importDefault(require("./currencies"));
const adapter = new FileAsync_1.default(path_1.default.join(__dirname, "db.json"));
const db = lowdb_1.default(adapter);
/* --------------------- Global Variable Initialization --------------------- */
const API_KEY = process.env.CURRENCYLAYER_API_KEY;
// currencyList= "AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG..."
const currencyList = Object.keys(currencies_1.default).join(",");
const apiUrl = `http://api.currencylayer.com/live?access_key=${API_KEY}&currencies=${currencyList}&format=1`;
/* ------------------- End Global Variable Initialization ------------------- */
function fetchAndSaveToLowDb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(url);
        if (response.data.success) {
            (yield db).set("rate", response.data).write();
            (yield db).set("lastFetchAt", Date.now()).write();
            return;
        }
        else {
            console.log(response.data.error.info);
        }
    });
}
exports.fetchAndSaveToLowDb = fetchAndSaveToLowDb;
function updateLatestRate() {
    return __awaiter(this, void 0, void 0, function* () {
        const rate = (yield db).get("rate").value();
        const lastFetchAt = (yield db).get("lastFetchAt").value();
        // set 4 hours as interval = 14,400,000 milliseconds
        const fourHours = 1000 * 60 * 60 * 4;
        if (!rate || Date.now() - lastFetchAt > fourHours) {
            console.log("Fetch new rate !");
            yield fetchAndSaveToLowDb(apiUrl);
        }
        // fetch rate every 4 hours
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield fetchAndSaveToLowDb(apiUrl);
            console.log("Fetched new rate at ", new Date().toString());
        }), fourHours);
    });
}
exports.updateLatestRate = updateLatestRate;
function convert(amount = 1, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rate = (yield db).get("rate").value();
            const { quotes, timestamp } = rate;
            const USDFromRate = parseFloat(quotes[`USD${from.toUpperCase()}`]);
            const USDToRate = parseFloat(quotes[`USD${to.toUpperCase()}`]);
            // console.log(quotes[`USDRMB`]);
            return {
                amount,
                from,
                to,
                timestamp,
                value: (amount * USDToRate) / USDFromRate,
            };
        }
        catch (e) {
            console.log("Exchange:convert Error fetching rates");
            return null;
        }
    });
}
exports.convert = convert;
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rate = (yield db).get("rate").value();
            return rate;
        }
        catch (e) {
            console.log("Cannot get rate from DB");
        }
    });
}
exports.getAll = getAll;
//# sourceMappingURL=exchange.js.map