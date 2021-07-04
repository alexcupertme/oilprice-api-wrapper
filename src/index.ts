import axios from "axios";

const DEFAULT_GATE: string = "https://api.oilpriceapi.com/v1/prices";

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

type PriceType = "spot_price" | "daily_average_price";
type OilType = "WTI_USD" | "BRENT_CRUDE_USD";

type Options = {
	priceType?: PriceType;
	oilType?: OilType;
	periodFrom?: number;
	periodTo?: number;
};

type OilResponse = {
	status: string;
	data?: {
		prices?: Array<any>;
	};
};

interface IOilPrice {
	latest(token: string, options: Options): Promise<OilResponse>;
	pastDay(token: string): Promise<OilResponse>;
	pastWeek(token: string): Promise<OilResponse>;
	pastMonth(token: string): Promise<OilResponse>;
	pastYear(token: string): Promise<OilResponse>;
}

async function getOilPrice(method: string, token: string, options?: Options) {
	// prettier-ignore
	console.log(`${DEFAULT_GATE}${method === null || undefined || "" ? "" : method}${options != undefined?`?${options.oilType != undefined ? `${PARAMETERS.byCode}=${options.oilType}&` : ""}${options.priceType != undefined ? `${PARAMETERS.byType}=${options.priceType}&` : ""}${options.periodFrom != undefined && options.periodTo != undefined ? `${PARAMETERS.byPeriod}[from]=${options.periodFrom}&${PARAMETERS.byPeriod}[to]=${options.periodTo}` : ""}`: ""}`);
	// prettier-ignore
	return await axios({
		url: `${DEFAULT_GATE}${method === null || undefined || "" ? "" : method}${options != undefined?`?${options.oilType != undefined ? `${PARAMETERS.byCode}=${options.oilType}&` : ""}${options.priceType != undefined ? `${PARAMETERS.byType}=${options.priceType}&` : ""}${options.periodFrom != undefined && options.periodTo != undefined ? `${PARAMETERS.byPeriod}[from]=${options.periodFrom}&${PARAMETERS.byPeriod}[to]=${options.periodTo}` : ""}`: ""}`,
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

class OilPrice implements IOilPrice {
	constructor() {}
	async latest(token: string, options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.latestGate, token, options);
	}
	async pastDay(token: string, options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.pastDayGate, token, options);
	}
	async pastWeek(token: string, options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.pastWeekGate, token, options);
	}
	async pastMonth(token: string, options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.pastMonthGate, token, options);
	}
	async pastYear(token: string, options?: Options): Promise<OilResponse> {
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
