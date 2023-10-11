
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Queue } from "sst/node/queue";
import AWS from "aws-sdk";
import { randomUUID } from "crypto";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import {  Failure, Pending, Started } from "./../estados";

const sqs = new AWS.SQS();

const clientSqs = new SQSClient();

export type bodyRequestTwilio = {
  from: string,
  to: string,
  message: string
  smsId: string
  clientName: string
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if(!event.body){
    throw Error('Invalid Params')
  }
  const body: Omit<bodyRequestTwilio, "smsId"> = JSON.parse(event.body);
  const smsId :string = randomUUID().toString();
  
  const data : bodyRequestTwilio={...body,"smsId": smsId};

  await Pending(data);
  //encolar 
  await clientSqs.send(new SendMessageCommand({
    QueueUrl:  Queue.QueueSMSTwilio.queueUrl,
    MessageBody: JSON.stringify(smsId), //enviar solo ID
  }))
  .then(async()=>{
    await Started(smsId);
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: smsId,
    }),
  };
};