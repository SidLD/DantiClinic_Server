import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserSchema from '../schema/UserSchema'
import { IUser, Iappointment } from '../util/interface'
import mongoose from 'mongoose'
import { link } from 'fs'
import AppointmentSchema from '../schema/AppointmentSchema'
import { log } from 'console'

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
            .collation({ locale: "en" })
            .sort(params.sort)
            .limit(params.limit)
            .populate('patient', 'username _id status mobile email')
            .populate('doctor', 'username _id status mobile email')
            res.status(200).send({data:appointments})
        }else if(req.user.role == 'doctor'){
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
                status: {$ne : 'complete'},
                doctor: new mongoose.Types.ObjectId(req.user.id)
            })
            .collation({ locale: "en" })
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
                ],
                status: {$ne : 'complete'},
            })
            .collation({ locale: "en" })
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

export const getOneAppointment = async (req: any, res: any) => {
    try {
        const params = req.query
        const appointment: Iappointment | null = await AppointmentSchema.findOne({
            _id: new mongoose.Types.ObjectId(params.appointmentId)
        })
        .populate('patient', 'username _id status mobile email  address gender contact birthdate')
        .populate('doctor', 'username _id status mobile email  address gender contact birthdate')
        res.status(200).send({data:appointment})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}

export const getAppointmentForPDF = async (req: any, res: any) => {
    try {
        const params = req.query
        const appointments: Array<Iappointment> = await AppointmentSchema.where({
            patient: new mongoose.Types.ObjectId(params.patientId)
        })
        .populate('patient', 'username _id status mobile email address gender contact birthdate')
        .populate('doctor', 'username _id status mobile email address gender contact birthdate')
        res.status(200).send({data:{
            user: appointments[0].patient,
            appointments: appointments
        }})
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
            ,{date: new Date(params.date), title : params.title, status: 'approve'}).populate('patient')
            res.status(200).send({data:result})
        }else if(req.user.role == 'doctor'){
            const result = await AppointmentSchema.findOneAndUpdate(new mongoose.Types.ObjectId(params._id)
            ,{date: new Date(params.date), title : params.title, status: 'approve'}).populate('patient')
            res.status(200).send({data:result})
        }else if(req.user.role === 'patient' && appointment?.status === 'pending'){
            const result = await AppointmentSchema.findOneAndUpdate(new mongoose.Types.ObjectId(params._id)
            ,{date: new Date(params.date), title : params.title}).populate('patient')
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
export const completeAppointment = async (req:any, res:any) => {
    try {
        const params = req.body
        const result: any | null = 
            await AppointmentSchema.findOneAndUpdate(
                {_id: new mongoose.Types.ObjectId(params._id)},
                {
                    findings : params.findings,
                    status: 'complete'
                }
            )
        res.status(200).send({data: result})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const getRecords = async (req:any, res:any) => {
    try {
        const params = req.query
        if(req.user.role == 'patient'){
            const users: Array<IUser> = await UserSchema.where({
                _id: new mongoose.Types.ObjectId(req.user.id)
            })
            .sort(params.sort)
            .limit(params.limit)
            .select(['_id', 'username', 'role', 'email', 'mobile', 'status'])
            res.status(200).send({data:users})
        }else{
            const tempUsers:Array<IUser> = await UserSchema.where({
                $or: [
                    {'username.firstName': 
                        { '$regex' : params.search, '$options' : 'i' }
                    },
                    {'username.lastName': 
                        { '$regex' : params.search, '$options' : 'i' }
                    },
                ],
            })
            const users: Array<Iappointment> = await AppointmentSchema.where({
                date: {
                    $gte: new Date(params.date?.from || new Date()+".000+00:00"),
                    $lte: new Date(params.date?.to || new Date() + ".000+00:00")
                },
                patient: {
                    $in: tempUsers.map(element => element._id)
                }
            })
            .sort(params.sort)
            .limit(params.limit)
            .populate('patient', ['_id', 'username', 'role', 'email', 'mobile', 'status'])
            let result:any = [];
            users.forEach(element => {
                if(!result.includes(element.patient)){
                    result.push(element.patient)
                }
            })
            res.status(200).send({data:result})
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Server Error"})
    }
}