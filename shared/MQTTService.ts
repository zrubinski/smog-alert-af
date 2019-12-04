import { connect, Client } from "mqtt";

export class MQTTService {
    private mqttBrokerHost: string;
    private mqttBrokerPort: number;
    private mqttBrokerClientName: string;
    private mqttTopic: string;

    constructor() {
        this.mqttBrokerHost = process.env['MQTT_BROKER_HOST'];
        this.mqttBrokerPort = +process.env['MQTT_BROKER_PORT'];
        this.mqttBrokerClientName = process.env['MQTT_BROKER_CLIENT_NAME'];
        this.mqttTopic = process.env['MQTT_BROKER_TOPIC'];
    }

    public publishEventVeryLow = () => {
        this.mqttPublish("event,VeryLow");
    }

    public publishEventLow = () => {
        this.mqttPublish("event,Low");
    }

    public publishEventMedium = () => {
        this.mqttPublish("event,Medium");
    }

    public publishEventHigh = () => {
        this.mqttPublish("event,High");
    }

    public publishEventVeryHigh = () => {
        this.mqttPublish("event,VeryHigh");
    }

    public publishEventExtreme = () => {
        this.mqttPublish("event,Extreme");
    }

    public publishEventAirmageddon = () => {
        this.mqttPublish("event,Airmageddon");
    }

    private mqttPublish = (message: string) => {
        try {
            let connectionString = ['mqtt', '//' + this.mqttBrokerHost, this.mqttBrokerPort].join(":");

            let client: Client = connect(connectionString,
                {
                    clientId: this.mqttBrokerClientName
                });

            let mqttTopic = this.mqttTopic;
            client.on("connect", function () {
                client.publish(mqttTopic, message);
                client.end();
            });

            client.on("error", function (error) {
                console.log("Can't connect" + error);
            });
        } catch (error) {
            console.log(error);
        }
    }

}
