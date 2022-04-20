import mongoose, {Schema} from 'mongoose';
import {CacheMassage} from '../models/CacheMassage';
import {Request, Response} from 'express';


const MongoUrl = "mongodb://localhost:27017/CacheManager";

const ServiceResponseModel = new Schema({
  data:{ type : Object },
  requestId:{type: String }
});

export class CacheManager{
    // save response
    public async saveResponse(massage:CacheMassage){
        const conn = await mongoose.connect(MongoUrl);
        const MyModel = mongoose.model('ServiceResponse', ServiceResponseModel);
        const resultObject = new MyModel({ data: JSON.stringify(massage) , requestId: massage.uuid });
        resultObject.save(()=>console.log("data saved")); 
    }

    // Load resposne
    public async findResponse(req:Request, res:Response){
      const conn = await mongoose.connect(MongoUrl);
      const MyModel = mongoose.model('ServiceResponse', ServiceResponseModel);
      const requestIdParam = req.query.id;

      const data = await MyModel.findOne({requestId: requestIdParam});
      return res.json(data);
    }
}

