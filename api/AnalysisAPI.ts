import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { getAppintmentsInDate, getAppointmentsData, getCountAllStatus, getUserSummary } from '../controller/AnalysisController';
dotenv.config()
const analysisAPI = express()
const apiVersion = process.env.API_VERSION;

analysisAPI.get(`/${apiVersion}/user-summary`, verifyToken, getUserSummary);
analysisAPI.get(`/${apiVersion}/appointment-status-count`, verifyToken, getCountAllStatus);
analysisAPI.get(`/${apiVersion}/appointment-status-date`, verifyToken, getAppintmentsInDate);
analysisAPI.get(`/${apiVersion}/appointment-backup`, verifyToken, getAppointmentsData);



export default analysisAPI