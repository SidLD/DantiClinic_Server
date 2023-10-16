import express from 'express'
import dotenv from 'dotenv'
import { register } from '../controller/UserController';
dotenv.config()
const userAPI = express()
const apiVersion = process.env.API_VERSION;

userAPI.post(`/${apiVersion}/register`, register);

export default userAPI