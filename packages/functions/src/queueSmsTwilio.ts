import { SQSEvent } from "aws-lambda";
import { sendMessage } from "./twiliioSms";
import { Failure, Started, Sucess } from "./estados";


export async function main(event: SQSEvent) {
  const records: any[] = event.Records;
  for (let index = 0; index < records.length; index++) {
    const element = records[index];
    const id = JSON.parse(element.body);
    
    await sendMessage(id);
    
    await Sucess(id);

    console.info(`Message processed: "${element.body}"`);
  }
}