var request = require('superagent');
require('superagent-proxy')(request);

export class AirlyService {

    private airlyApiKey: string;
    private airlyLat: number;
    private airlyLng: number;

    constructor() {
        this.airlyApiKey = process.env['AIRLY_API_KEY'];
        this.airlyLat = +process.env['AIRLY_LOCALIZATION_LAT'];
        this.airlyLng = +process.env['AIRLY_LOCALIZATION_LNG'];
    }

    public getAirlyIndex = async (): Promise<number> => {
        const url = `https://airapi.airly.eu/v2/measurements/point?lat=${this.airlyLat}&lng=${this.airlyLng}`;

        try {
            const response = await this.get(url);
            const indexValue = response.body.current.indexes[0].value;
            return indexValue;
        } catch (err) {
            return -1;
        }
    }

    private get = async (url): Promise<any> => {
        return request
            .get(url)
            .set('apikey', this.airlyApiKey)
            .set('Content-Type', 'application/json')
            .set('Accept-Encoding', 'application/gzip')
            .set('Accept-Language', 'pl');
    }
}