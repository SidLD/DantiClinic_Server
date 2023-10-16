import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import cors from 'cors'
import userAPI from './api/UserAPI';

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

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
    