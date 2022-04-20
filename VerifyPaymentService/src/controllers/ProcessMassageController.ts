import {Request, Response} from 'express';
import client ,  {Connection, Channel} from 'amqplib';
import {QueueInformation} from '../config/QueueInformation';
import { CheckMassageModel } from '../models/CheckMassageModel';
import  emails  from '../config/InvalidEmails';
import {CacheManager} from '../controllers/CacheManager';



export class ProcessMassageController{

   public async activateMassageProcessor(){
    const connection: Connection = await client.connect(QueueInformation.URI);
    const channel: Channel = await connection.createChannel();
    await channel.assertQueue(QueueInformation.QueueName)
      //load a massage
    channel.consume(QueueInformation.QueueName,(data)=>{
        console.log("we got a massage");
        console.log(data.content.toString());
        // do bussniess validations 
        const massage: CheckMassageModel = JSON.parse(data.content.toString());
        const cacheManager: CacheManager = new CacheManager();

        let rejectReason="";

        if(massage.country !=='UAE')
          rejectReason = "Not a valid Country";
        else if(massage.amount<1000)
          rejectReason= "Less than 1000";
        else if(emails.toUpperCase().includes(massage.email.toUpperCase()) )
          rejectReason="Not a valid Email";

        if(rejectReason.length === 0){
            // update cache DB with successful massage
            cacheManager.saveResponse({
              accepted: true, uuid:massage.uuid, serviceResponseMassage:"Accepted"
            });
            console.log(rejectReason)
        } else{  
          // update cache DB with failed massage
          cacheManager.saveResponse({
            accepted: false, uuid:massage.uuid, serviceResponseMassage:rejectReason
          });
        }
        channel.ack(data);
    });
  }
}