import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import cors from 'cors'
import userAPI from './api/UserAPI';
import mongoose from 'mongoose';
import appointmentAPI from './api/AppointmentAPI';

//For env File 
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 8888;
const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(bodyParser.json(), urlencodedParser);
const corsOptions = {
    origin: process.env.FRONT_URI // frontend URI (ReactJS)
}
app.use(cors(corsOptions));


//START of API
app.use(userAPI)
app.use(appointmentAPI)
//END of API

app.post('*', (req:Request, res:Response) => {
  res.status(404).send({message: "URI not FOUND"})
})
app.get('*',  (req:Request, res:Response) => {
  res.status(404).send({message: "URI not FOUND"})
})
app.put('*', (req:Request, res:Response) => {
  res.status(404).send({message: "URI not FOUND"})
})
app.delete('*', (req:Request, res:Response) => {
  res.status(404).send({message: "URI not FOUND"})
})

//Database
try {
  mongoose.set("strictQuery", false);
  mongoose.connect(`${process.env.ATLAS_URI}`);
  console.log(`Connected to Database ${`${process.env.ATLAS_URI}`}`)
} catch (error) {
  console.log(error)
}

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
    