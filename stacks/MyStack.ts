import { StackContext, Api , Queue, Table } from "sst/constructs";
//import { StorageStack } from "./storageStack";

export function API({ stack }: StackContext) {

  const tableSmsTwillio = new Table(stack, 'twilio_sms',{
    fields:{
      smsId: "string",
    },
    primaryIndex: {partitionKey: "smsId",}
  });

  const queueSMSTwilioFail = new Queue(stack, "QueueSMSTwilio2", {
    
  });
  queueSMSTwilioFail.addConsumer(stack, {
    function:{
      bind:[tableSmsTwillio],
      handler:"packages/functions/src/queueSmsTwilioFailure.main"
    }
  })

  const queueSMSTwilio = new Queue(stack, "QueueSMSTwilio", {
    cdk: {
      queue: {
        deadLetterQueue: {
          maxReceiveCount: 1,
          queue: queueSMSTwilioFail.cdk.queue
        }
      }
    }
  });
 
  queueSMSTwilio.addConsumer(stack,{
    function:{
      bind:[queueSMSTwilio, tableSmsTwillio],
      handler:"packages/functions/src/queueSmsTwilio.main"
    }
  });


  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [queueSMSTwilio,tableSmsTwillio]
      },
    },
    routes: {
      "POST /sms": "packages/functions/src/routes/PostSendSmsTwilio.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
