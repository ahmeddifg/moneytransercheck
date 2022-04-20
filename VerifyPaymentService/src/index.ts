import dotenv from "dotenv";
import express from "express";
import path from "path";
import {ProcessMassageController} from './controllers/ProcessMassageController';
import * as routes from "./routes";

// import * as routes from "./routes";

dotenv.config();

const port = 3001;
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const processMassageController = new ProcessMassageController();
processMassageController.activateMassageProcessor();

routes.register(app);
// start the express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
