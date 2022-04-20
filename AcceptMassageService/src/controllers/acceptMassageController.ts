import {Request, Response} from 'express';
import client ,  {Connection, Channel} from 'amqplib';
import {QueueInformation} from '../config/QueueInformation';
import { CheckMassageModel } from '../models/CheckMassageModel';
import { v4 as uuidv4 } from 'uuid';


export class AcceptMassageController{
  public async acceptMassage(req:Request, res:Response){
    const massage: CheckMassageModel = req.body;
    massage.uuid=uuidv4();
    const connection: Connection = await client.connect(QueueInformation.URI);
    // Create a channel
    const channel: Channel = await connection.createChannel()
    // Makes the queue available to the client
    await channel.assertQueue(QueueInformation.QueueName)
    channel.sendToQueue(QueueInformation.QueueName, Buffer.from(JSON.stringify(massage)));

    res.json(req.body);
  }
}