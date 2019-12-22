import { AirlyService } from "./AirlyService";
import { MQTTService } from "./MQTTService";
import { AzureStorageService } from "./AzureStorageService";

export class SmogAlertService {

    public checkAirlyIndex = () => {
        const airly = new AirlyService();
        airly.getAirlyData()
            .then(this.onCheckingAirlyIndex)
            .catch(this.onError);
    }

    private onCheckingAirlyIndex = (airlyData: IAirlyData) => {
        this.updateAzureTable(airlyData);
        this.publishMQTT(airlyData);
    }

    private onError = (error: any) => {
        console.log(error);
    }

    private updateAzureTable = (airlyData: IAirlyData) => {
        const service = new AzureStorageService();
        service.createAirlyTableIfNotExists();
        service.insertAirlyData(airlyData);
    }

    private publishMQTT = (airlyData: IAirlyData) => {
        if (airlyData === undefined || airlyData === null) {
            return;
        }

        const index = airlyData.index;

        let mqttService = new MQTTService();

        if (index < 25) {
            mqttService.publishEventVeryLow();
        } else if (index < 50) {
            mqttService.publishEventLow();
        } else if (index < 75) {
            mqttService.publishEventMedium();
        } else if (index < 87.5) {
            mqttService.publishEventHigh();
        } else if (index < 100) {
            mqttService.publishEventVeryLow();
        } else if (index < 125) {
            mqttService.publishEventExtreme();
        } else {
            mqttService.publishEventAirmageddon();
        }
    }
}