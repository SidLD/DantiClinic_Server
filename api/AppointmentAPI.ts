import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { completeAppointment, createAppointment, deleteAppointment, getAppointment, getOneAppointment, getRecords, rejectAppointment, updateAppointment } from '../controller/AppointmentController';
dotenv.config()
const appointmentAPI = express()
const apiVersion = process.env.API_VERSION;

appointmentAPI.post(`/${apiVersion}/appointment`, verifyToken, createAppointment);4
appointmentAPI.get(`/${apiVersion}/appointment`, verifyToken, getOneAppointment);
appointmentAPI.put(`/${apiVersion}/appointment`, verifyToken, updateAppointment);
appointmentAPI.put(`/${apiVersion}/appointment-complete`, verifyToken, completeAppointment);
appointmentAPI.get(`/${apiVersion}/appointments`, verifyToken, getAppointment);
appointmentAPI.delete(`/${apiVersion}/appointment`, verifyToken, deleteAppointment);
appointmentAPI.put(`/${apiVersion}/appointment/reject`, verifyToken, rejectAppointment);

appointmentAPI.get(`/${apiVersion}/records`, verifyToken, getRecords);



export default appointmentAPI