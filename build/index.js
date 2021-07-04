"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const DEFAULT_GATE = "https://api.oilpriceapi.com/v1/prices";
const METHODS = {
    latestGate: "/latest/",
    pastDayGate: "/past_day/",
    pastWeekGate: "/past_week/",
    pastMonthGate: "/past_month/",
    pastYearGate: "/past_year/",
};
const PARAMETERS = {
    byType: "by_type",
    byCode: "by_code",
    byPeriod: "by_period",
};
async function getOilPrice(method, token, options) {
    console.log(`${DEFAULT_GATE}${method === null || undefined || "" ? "" : method}${options != undefined ? `?${options.oilType != undefined ? `${PARAMETERS.byCode}=${options.oilType}&` : ""}${options.priceType != undefined ? `${PARAMETERS.byType}=${options.priceType}&` : ""}${options.periodFrom != undefined && options.periodTo != undefined ? `${PARAMETERS.byPeriod}[from]=${options.periodFrom}&${PARAMETERS.byPeriod}[to]=${options.periodTo}` : ""}` : ""}`);
    return await axios_1.default({
        url: `${DEFAULT_GATE}${method === null || undefined || "" ? "" : method}${options != undefined ? `?${options.oilType != undefined ? `${PARAMETERS.byCode}=${options.oilType}&` : ""}${options.priceType != undefined ? `${PARAMETERS.byType}=${options.priceType}&` : ""}${options.periodFrom != undefined && options.periodTo != undefined ? `${PARAMETERS.byPeriod}[from]=${options.periodFrom}&${PARAMETERS.byPeriod}[to]=${options.periodTo}` : ""}` : ""}`,
        headers: {
            Authorization: `Token ${token}`,
            "Content-type": "application/json",
        },
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        console.log(err.response.data);
    });
}
class OilPrice {
    constructor() { }
    async latest(token, options) {
        return await getOilPrice(METHODS.latestGate, token, options);
    }
    async pastDay(token, options) {
        return await getOilPrice(METHODS.pastDayGate, token, options);
    }
    async pastWeek(token, options) {
        return await getOilPrice(METHODS.pastWeekGate, token, options);
    }
    async pastMonth(token, options) {
        return await getOilPrice(METHODS.pastMonthGate, token, options);
    }
    async pastYear(token, options) {
        return await getOilPrice(METHODS.pastYearGate, token, options);
    }
}
const oilPrice = new OilPrice();
oilPrice
    .pastMonth("6d433595fc72d0d1715ee75edb1f2f49", {
    priceType: "daily_average_price",
    oilType: "WTI_USD",
})
    .then((res) => console.log(res.data));
