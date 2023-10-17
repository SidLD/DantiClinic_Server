import express from 'express'
import dotenv from 'dotenv'
import { login, preRegister, register , getUserRegisterPending} from '../controller/UserController';
import { verifyToken } from '../util/verify';
dotenv.config()
const userAPI = express()
const apiVersion = process.env.API_VERSION;

userAPI.post(`/${apiVersion}/pre-register`, preRegister);
userAPI.post(`/${apiVersion}/register`, register);
userAPI.post(`/${apiVersion}/login`, login);
userAPI.get(`/${apiVersion}/users/pending`,verifyToken ,getUserRegisterPending);


export default userAPI