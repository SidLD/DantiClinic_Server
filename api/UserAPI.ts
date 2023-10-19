import express from 'express'
import dotenv from 'dotenv'
import { login, preRegister, register , getPreRegister} from '../controller/UserController';
import { verifyToken } from '../util/verify';
dotenv.config()
const userAPI = express()
const apiVersion = process.env.API_VERSION;

userAPI.post(`/${apiVersion}/pre-register`, preRegister);
userAPI.get(`/${apiVersion}/pre-register`, getPreRegister);
userAPI.post(`/${apiVersion}/register`, verifyToken ,register);
userAPI.post(`/${apiVersion}/login`, login);


export default userAPI