import { Table } from "sst/node/table";
import { DynamoDB } from "aws-sdk";
const dynamoDb = new DynamoDB.DocumentClient();

type bodyRequestTwilio = {
    from: string,
    to: string,
    message: string
    smsId: string
    clientName: string
  }
export async function Started(smsId: string) {
    console.log('Started');
    
    const updateParams: any = {
        TableName: Table.twilio_sms.tableName,
        Key: {
            smsId: smsId
        },
        UpdateExpression: 'set #status = :status ',
        ExpressionAttributeNames: { '#status': "status" },
        ExpressionAttributeValues: {
            ':status': 'STARTED',
        }
    }
    await dynamoDb.update(updateParams).promise();
}

export async function Pending(params: bodyRequestTwilio) {
    console.log('Pending');
    const getParams: any = {
        TableName: Table.twilio_sms.tableName,
        Item: {
            smsId: params.smsId,
            message: params.message,
            from: params.from,
            to: params.to,
            status: 'PENDING',
            client_name: params.clientName,
            created_at: Date.now()
        },
    };
    await dynamoDb.put(getParams).promise();
}
export async function Failure(smsId: string) {
    console.log('Failure');
    const getParams: any = {
        TableName: Table.twilio_sms.tableName,
        Key: {
            smsId: smsId,
        },
        UpdateExpression: 'set #status = :status ',
        ExpressionAttributeNames: { '#status': "status" },
        ExpressionAttributeValues: {
            ':status': 'FAILURE',
        }
    };
    await dynamoDb.update(getParams).promise();
}
export async function Sucess(smsId: string) {
    console.log('Sucess');
    
    const getParams: any = {
        TableName: Table.twilio_sms.tableName,
        Key: {
            smsId: smsId,
        },
        UpdateExpression: 'set #status = :status ',
        ExpressionAttributeNames: { '#status': "status" },
        ExpressionAttributeValues: {
            ':status': 'SUCCESS',
        }
    };
    await dynamoDb.update(getParams).promise();
}