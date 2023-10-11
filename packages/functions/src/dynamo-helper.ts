
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
const dynamoDb = new DynamoDB.DocumentClient();

export function getSmsById (id: string){
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: Table.twilio_sms.tableName,
        Key: {
            smsId: id
        }
    }
    const result = dynamoDb.get(params).promise();
    return result;
}