import * as express from "express";
import {CacheManager} from '../controllers/CacheManager';

export const register = (app: express.Application) => {
    app.route('/').get(new CacheManager().findResponse);
};
