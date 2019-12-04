import { AirlyService } from "./AirlyService";
import { MQTTService } from "./MQTTService";

export class SmogAlertService {

    public checkAirlyIndex = () => {

        const airly = new AirlyService();
        airly.getAirlyIndex()
            .then((index: number) => {

                if (index < 0) {
                    return;
                }

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

            })
            .catch(err => console.log(err));

    }
}