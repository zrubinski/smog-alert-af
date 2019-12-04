import { AzureFunction, Context } from "@azure/functions"
import { SmogAlertService } from "../shared/SmogAlertService";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {

    new SmogAlertService().checkAirlyIndex();

    var timeStamp = new Date().toISOString();
    if (myTimer.IsPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp);
};

export default timerTrigger;
