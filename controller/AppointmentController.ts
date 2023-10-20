import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserSchema from '../schema/UserSchema'
import { IUser, Iappointment } from '../util/interface'
import mongoose from 'mongoose'
import { link } from 'fs'
import AppointmentSchema from '../schema/AppointmentSchema'

export const createAppointment = async (req:any, res:any) => {
    try {
        let params = req.body
        if(req.user.role ==='admin'){
            const newAppointment = await AppointmentSchema.create({
                patient : new mongoose.Types.ObjectId(params.patient),
                doctor : new mongoose.Types.ObjectId(params.doctor),
                status: params.status,
                title: params.title,
                date: new Date(params.date)
            })
            res.status(200).send({message: newAppointment})
        }else{
            const newAppointment = await AppointmentSchema.create({
                patient : new mongoose.Types.ObjectId(req.user.id),
                doctor : new mongoose.Types.ObjectId(params.doctor),
                status: params.status,
                title: params.title,
                date: new Date(params.date),
                log: [{
                    user: new mongoose.Types.ObjectId(req.user.id),
                    detail: "Create Appointment"
                }]
            })
            res.status(200).send({message: newAppointment})
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}

export const getAppointment = async (req:any, res:any) => {
    try {
        const params = req.query
        if(req.user.role === 'patient'){
            const appointments: Array<Iappointment> = await AppointmentSchema.where({
                $or: [
                    {'patient.username.firstName': params.search},
                    {'patient.username.lastName': params.search},
                    {'patient.username.email': params.search},
                    {'doctor.username.firstName': params.search},
                    {'doctor.username.lastName': params.search},
                    {'doctor.username.email': params.search},
                    {'title': params.search},
                ],
                patient: new mongoose.Types.ObjectId(req.user.id)
            })
            .sort(params.sort)
            .limit(params.limit)
            .populate('patient', 'username _id status mobile email')
            .populate('doctor', 'username _id status mobile email')
            res.status(200).send({data:appointments})
        }else{
            const appointments: Array<Iappointment> = await AppointmentSchema.where({
                $or: [
                    {'patient.username.firstName': params.search},
                    {'patient.username.lastName': params.search},
                    {'patient.username.email': params.search},
                    {'doctor.username.firstName': params.search},
                    {'doctor.username.lastName': params.search},
                    {'doctor.username.email': params.search},
                    {'title': params.search},
                ]
            })
            .sort(params.sort)
            .limit(params.limit)
            .populate('patient', 'username _id status mobile email')
            .populate('doctor', 'username _id status mobile email')
            res.status(200).send({data:appointments})
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
