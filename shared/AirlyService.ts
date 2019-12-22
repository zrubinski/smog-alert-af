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

    public getAirlyData = async (): Promise<IAirlyData> => {
        const url = `https://airapi.airly.eu/v2/measurements/point?lat=${this.airlyLat}&lng=${this.airlyLng}`;

        try {
            const response = await this.get(url);
            const airlyIndex = response.body.current.indexes.find(x => x.name === 'AIRLY_CAQI');
            const values = response.body.current.values;
            return <IAirlyData>{
                lat: this.airlyLat,
                lng: this.airlyLng,
                index: airlyIndex.value,
                level: airlyIndex.level,
                description: airlyIndex.description,
                advice: airlyIndex.advice,
                levelColor: airlyIndex.color,
                PM1: values.find(x => x.name === 'PM1').value,
                PM25: values.find(x => x.name === 'PM25').value,
                PM10: values.find(x => x.name === 'PM10').value,
                pressure: values.find(x => x.name === 'PRESSURE').value,
                humidity: values.find(x => x.name === 'HUMIDITY').value,
                temperature: values.find(x => x.name === 'TEMPERATURE').value
            };
        } catch (err) {
            return null;
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