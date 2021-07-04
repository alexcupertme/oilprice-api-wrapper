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
};

type OilResponse = {
	status: string;
	data?: {
		prices?: Array<any>;
	};
};

interface IOilPrice {
	latest(options?: Options): Promise<OilResponse>;
	pastDay(options?: Options): Promise<OilResponse>;
	pastWeek(options?: Options): Promise<OilResponse>;
	pastMonth(options?: Options): Promise<OilResponse>;
	pastYear(options?: Options): Promise<OilResponse>;
}

async function getOilPrice(method: string, token: string, options?: Options, periodFrom?: number, periodTo?: number) {
	// prettier-ignore
	console.log(`${DEFAULT_GATE}${method === null || undefined || "" ? "" : method}${options != undefined?`?${options.oilType != undefined ? `${PARAMETERS.byCode}=${options.oilType}&` : ""}${options.priceType != undefined ? `${PARAMETERS.byType}=${options.priceType}&` : ""}${periodFrom != undefined && periodTo != undefined ? `${PARAMETERS.byPeriod}[from]=${periodFrom}&${PARAMETERS.byPeriod}[to]=${periodTo}` : ""}`: ""}`);
	// prettier-ignore
	return await axios({
		url: `${DEFAULT_GATE}${method === null || undefined || "" ? "" : method}${options != undefined?`?${options.oilType != undefined ? `${PARAMETERS.byCode}=${options.oilType}&` : ""}${options.priceType != undefined ? `${PARAMETERS.byType}=${options.priceType}&` : ""}${periodFrom != undefined && periodTo != undefined ? `${PARAMETERS.byPeriod}[from]=${periodFrom}&${PARAMETERS.byPeriod}[to]=${periodTo}` : ""}`: ""}`,
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
	token: string;
	/**
	 *
	 * @param token Your token from https://www.oilpriceapi.com/dashboard
	 */
	constructor(token: string) {
		this.token = token;
	}
	async latest(options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.latestGate, this.token, options);
	}

	async pastDay(options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.pastDayGate, this.token, options);
	}
	async pastWeek(options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.pastWeekGate, this.token, options);
	}
	async pastMonth(options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.pastMonthGate, this.token, options);
	}
	async pastYear(options?: Options): Promise<OilResponse> {
		return await getOilPrice(METHODS.pastYearGate, this.token, options);
	}
}

const oilPrice = new OilPrice("6d433595fc72d0d1715ee75edb1f2f49");

oilPrice
	.pastMonth({
		priceType: "daily_average_price",
		oilType: "WTI_USD",
	})
	.then((res) => console.log(res.data));
