import express from 'express'
import dotenv from 'dotenv'
import { login, preRegister, register } from '../controller/UserController';
dotenv.config()
const userAPI = express()
const apiVersion = process.env.API_VERSION;

userAPI.post(`/${apiVersion}/pre-register`, preRegister);
userAPI.post(`/${apiVersion}/register`, register);
userAPI.post(`/${apiVersion}/login`, login);


export default userAPI