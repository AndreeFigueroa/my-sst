import { SQSEvent } from "aws-lambda";
import { sendMessage } from "./twiliioSms";
import { Failure, Sucess } from "./estados";


export async function main(event: SQSEvent) {
  const records: any[] = event.Records;
  for (let index = 0; index < records.length; index++) {
    const element = records[index];
    const data = JSON.parse(element.body);
    
    await Failure(data);

    console.info(`Message Failure: "${element.body}"`);
  }
}