import { Context } from "@azure/functions";

var azure = require('azure-storage');

export class AzureStorageService {
    private azureWebJobsStorage: string;

    private airlyTableName: string;
    private airlyPartitionKey: string;
    private airlyCurrentRowKey: string;

    constructor() {
        this.azureWebJobsStorage = process.env['AzureWebJobsStorage'];
        this.airlyTableName = 'Airly';
        this.airlyPartitionKey = 'Airly';
        this.airlyCurrentRowKey = 'current';
    }

    private getTableService = (): any => {
        return azure.createTableService(this.azureWebJobsStorage);
    }

    private createTableIfNotExists = (tableName: string) => {
        const tableService = this.getTableService();
        tableService.createTableIfNotExists(tableName, function (error, result, response) {
            if (error) {
                console.log('error during creating table : ' + tableService);
            }
        });
    }

    public createAirlyTableIfNotExists = () => {
        this.createTableIfNotExists(this.airlyTableName);
    }

    private createTask(date: Date, data: IAirlyData, rowKey?: string) {
        const entGen = azure.TableUtilities.entityGenerator;
        return {
            PartitionKey: entGen.String(this.airlyPartitionKey),
            RowKey: entGen.String(rowKey || date.toISOString()),
            lat: entGen.Double(data.lat),
            lng: entGen.Double(data.lng),
            index: entGen.Double(data.index),
            level: entGen.String(data.level),
            description: entGen.String(data.description),
            advice: entGen.String(data.advice),
            levelColor: entGen.String(data.levelColor),
            PM1: entGen.Double(data.PM1),
            PM25: entGen.Double(data.PM25),
            PM10: entGen.Double(data.PM10),
            pressure: entGen.Double(data.pressure),
            humidity: entGen.Double(data.humidity),
            temperature: entGen.Double(data.temperature),
            airlyData: entGen.String(JSON.stringify(data))
        };
    }

    public insertAirlyData = (data: IAirlyData) => {
        const date = new Date();

        const batch = new azure.TableBatch();
        batch.insertEntity(this.createTask(date, data), { echoContent: true });
        batch.insertOrReplaceEntity(this.createTask(date, data, this.airlyCurrentRowKey), { echoContent: true });

        const tableService = this.getTableService();
        tableService.executeBatch(this.airlyTableName, batch, function (error, result, response) {
            if (!error) {
                console.log('data inserted');
            }
        });
    }

    public getLatestAirlyData = (context: Context) => {
        const query = new azure.TableQuery()
            .select(['airlyData'])
            .top(1)
            .where('PartitionKey eq ? and RowKey eq ?', this.airlyPartitionKey, this.airlyCurrentRowKey);

        const tableService = this.getTableService();
        tableService.queryEntities(this.airlyTableName, query, null, function (error, result, response) {
            if (!error) {
                context.res = {
                    status: 200,
                    body: response.body.value[0].airlyData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
            } else {
                context.res.status(500).json({ error: error });
            }
            context.done();
        });
    }
}