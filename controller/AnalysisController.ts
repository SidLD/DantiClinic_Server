import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserSchema from '../schema/UserSchema'
import { IUser, Iappointment } from '../util/interface'
import mongoose from 'mongoose'
import AppointmentSchema from '../schema/AppointmentSchema'

export const getCountAllStatus = async (req:any, res:any) => {
    try {
        const params = req.query
        const approved = await AppointmentSchema.where({status: 'approved'}).count()
        const forAdmin = await AppointmentSchema.where({status: 'forAdmin'}).count()
        const forDoctor = await  AppointmentSchema.where({status: 'forDoctor'}).count()
        const complete = await AppointmentSchema.where({status: 'complete'}).count()
        const reject = await AppointmentSchema.where({status: 'reject'}).count()
        const data = {
            approved, forAdmin, forDoctor, complete, reject
        }
        res.status(200).send(data)
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Server Error"})
    }
}

export const getUserSummary = async (req:any, res:any) => {
    try {
        const params = req.query
        const patientCount = await UserSchema.where({ role: 'patient'}).count()
        const totalDoctorCount = await UserSchema.where({ role: 'doctor'}).count()
        const doctorCount = await   UserSchema.where({ status:'available' , role: 'doctor'}).count()
        const data = {
            patientCount, doctorCount, totalDoctorCount
        }
        res.status(200).send(data)
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Server Error"})
    }
}

export const getAppintmentsInDate = async (req:any, res:any) => {
    try {
        const params = req.query
        const appointmentCount = await AppointmentSchema.find({ //query today up to tonight
            createdAt: {
                $gte: new Date(params.dateOne), 
                $lt: new Date(params.dateTwo)
            }
        }).count()
        const userCount = await UserSchema.find({
            role: 'patient', //query today up to tonight
            createdAt: {
                $gte: new Date(params.dateOne), 
                $lt: new Date(params.dateTwo)
            }
        }).count()
        res.status(200).send({data:{appointmentCount, userCount}})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Server Error"})
    }
}

export const getAppointmentsData = async (req:any, res:any) => {
    try {
        const params = req.query
        const data: Array<any> = await AppointmentSchema.where({})
        .populate('doctor', 'username')
        .populate('patient', 'username')
        res.status(200).send({data:data})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Server Error"})
    }
}