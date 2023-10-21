import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { createAppointment, deleteAppointment, getAppointment, rejectAppointment, updateAppointment } from '../controller/AppointmentController';
dotenv.config()
const appointmentAPI = express()
const apiVersion = process.env.API_VERSION;

appointmentAPI.post(`/${apiVersion}/appointment`, verifyToken, createAppointment);
appointmentAPI.put(`/${apiVersion}/appointment`, verifyToken, updateAppointment);
appointmentAPI.get(`/${apiVersion}/appointments`, verifyToken, getAppointment);
appointmentAPI.delete(`/${apiVersion}/appointment`, verifyToken, deleteAppointment);
appointmentAPI.put(`/${apiVersion}/appointment/reject`, verifyToken, rejectAppointment);



export default appointmentAPI