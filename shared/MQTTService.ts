import { connect, Client } from "mqtt";

var mqttBrokerHost = 'broker.hivemq.com';
var mqttBrokerPort = 1883;
var mqttBrokerClientName = 'IDEAapp_AF';
var mqttTopic = 'IDEAapp/cmd';

export class MQTTService {

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
            let connectionString = ['mqtt', '//' + mqttBrokerHost, mqttBrokerPort].join(":");

            let client: Client = connect(connectionString,
                {
                    clientId: mqttBrokerClientName
                });

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
