import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AzureStorageService } from "../shared/AzureStorageService";

const httpTrigger: AzureFunction = function (context: Context, req: HttpRequest): void {
    new AzureStorageService().getLatestAirlyData(context);
};

export default httpTrigger;
