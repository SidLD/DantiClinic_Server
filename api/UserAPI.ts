import express from 'express'
import dotenv from 'dotenv'
import { login, preRegister, register , getPreRegister, getUsers, getUserData, updateUser, updatePassword, uploadProfile, getUserRecord, getDoctorIntro, generatePIN} from '../controller/UserController';
import { verifyToken } from '../util/verify';
dotenv.config()
const userAPI = express()
const apiVersion = process.env.API_VERSION;

userAPI.post(`/${apiVersion}/pre-register`, preRegister);
userAPI.post(`/${apiVersion}/user/pin`, verifyToken, generatePIN);

userAPI.get(`/${apiVersion}/pre-register`, getPreRegister);
userAPI.get(`/${apiVersion}/doctor-info`, getDoctorIntro);
userAPI.get(`/${apiVersion}/users`, verifyToken, getUsers);
userAPI.get(`/${apiVersion}/user-data`, verifyToken, getUserData)
userAPI.get(`/${apiVersion}/user-records`, verifyToken, getUserRecord)
userAPI.post(`/${apiVersion}/register` ,register);
userAPI.put(`/${apiVersion}/users`, verifyToken ,updateUser);
userAPI.put(`/${apiVersion}/user-password`, verifyToken ,updatePassword);
userAPI.put(`/${apiVersion}/user-profile`, verifyToken , uploadProfile);
userAPI.post(`/${apiVersion}/login`, login);


export default userAPI