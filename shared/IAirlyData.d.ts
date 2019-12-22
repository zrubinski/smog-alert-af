interface IAirlyData {
    lat: number;
    lng: number;
    index: number;
    level: string;
    description: string;
    advice: string;
    levelColor: string;
    PM1: number,
    PM25: number,
    PM10: number,
    pressure: number;
    humidity: number;
    temperature: number;
}