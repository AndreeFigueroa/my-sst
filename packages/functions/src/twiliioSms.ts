const accountSid = "";
const authToken = "";
const phone = "";


import { default as twilio } from 'twilio';
import { getSmsById } from './dynamo-helper';
const clientTwilio = twilio(accountSid, authToken);

export type RequestMessage = {
    from: string;
    to: string;
    message: string;
};

export type ResponseMessage = {
    status: string;
    body?: Record<string, any>; //objeto generico {attr: value}
};

export async function sendMessage(id: string): Promise<ResponseMessage> {
    const result = await getSmsById(id);
    if (!result.Item) {
        throw Error ("No existe el mensaje buscado");
    }
    const res = await clientTwilio.messages
        .create({
            body: result.Item.message,
            from: result.Item.from,
            to: result.Item.to
        });
        
    return {
        status: res.status,
        body: res
    }
    
}
/* ts-node --esm packages/functions/src/twiliioSms.ts
(async () => {

    await sendMessage({
        from: phone,
        to: '+56958407719',
        message: 'hola'
    });

})(); */