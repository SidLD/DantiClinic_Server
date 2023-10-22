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
                    {'title':  { $regex: '.*' + params.search + '.*' }},
                ],
                patient: new mongoose.Types.ObjectId(req.user.id)
            })
            .sort(params.sort)
            .limit(params.limit)
            .populate('patient', 'username _id status mobile email')
            .populate('doctor', 'username _id status mobile email')
            res.status(200).send({data:appointments})
        }else if(req.user.doctor){
            const appointments: Array<Iappointment> = await AppointmentSchema.where({
                $or: [
                    {'patient.username.firstName': params.search},
                    {'patient.username.lastName': params.search},
                    {'patient.username.email': params.search},
                    {'doctor.username.firstName': params.search},
                    {'doctor.username.lastName': params.search},
                    {'doctor.username.email': params.search},
                    {'title': { $regex: '.*' + params.search + '.*' }},
                ],
                doctor: new mongoose.Types.ObjectId(req.user.id)
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
                    {'title': { $regex: '.*' + params.search + '.*' }},
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

export const updateAppointment = async (req:any, res:any) => {
    try {
        const params = req.body
        const appointment: Iappointment | null = await AppointmentSchema.findById(new mongoose.Types.ObjectId(params._id))
        if( req.user.role == 'admin'){     
            const result = await AppointmentSchema.findOneAndUpdate(new mongoose.Types.ObjectId(params._id)
            ,{date: new Date(params.date), title : params.title, status: 'forDoctor'})
            res.status(200).send({data:result})
        }else if(req.user.role == 'doctor'){
            const result = await AppointmentSchema.findOneAndUpdate(new mongoose.Types.ObjectId(params._id)
            ,{date: new Date(params.date), title : params.title, status: 'approve'})
            res.status(200).send({data:result})
        }else if(req.user.role === 'patient' && appointment?.status === 'forAdmin'){
            const result = await AppointmentSchema.findOneAndUpdate(new mongoose.Types.ObjectId(params._id)
            ,{date: new Date(params.date), title : params.title})
            res.status(200).send({data:result})
        }else{
            res.status(400).send({message:"Access Denied"})
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const deleteAppointment = async (req:any, res:any) => {
    try {
        const params = req.body
        const appointment: any | null = await AppointmentSchema.findByIdAndDelete({
            _id:  new mongoose.Types.ObjectId(params._id),
            patient:  new mongoose.Types.ObjectId(req.user._id),
        })
        res.status(200).send({data: appointment})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const rejectAppointment = async (req:any, res:any) => {
    try {
        const params = req.body
        const appointment: Iappointment | null = await AppointmentSchema.findOneAndUpdate(
            new mongoose.Types.ObjectId(params._id),{
            status: 'reject'
        })
        res.status(200).send({data: appointment})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}