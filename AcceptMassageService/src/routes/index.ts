import * as express from "express";
import {AcceptMassageController} from '../controllers/AcceptMassageController';


export const register = (app: express.Application) => {
    const  acceptMassageController: AcceptMassageController = new AcceptMassageController();
    app.route('/').post(acceptMassageController.acceptMassage);
};
