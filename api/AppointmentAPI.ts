import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { createAppointment, getAppointment } from '../controller/AppointmentController';
dotenv.config()
const appointmentAPI = express()
const apiVersion = process.env.API_VERSION;

appointmentAPI.post(`/${apiVersion}/appointment`, verifyToken, createAppointment);
appointmentAPI.get(`/${apiVersion}/appointments`, verifyToken, getAppointment);


export default appointmentAPI