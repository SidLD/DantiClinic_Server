import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserSchema from '../schema/UserSchema'
import { IUser, Iappointment } from '../util/interface'
import mongoose from 'mongoose'
import { link } from 'fs'
import AppointmentSchema from '../schema/AppointmentSchema'

export const preRegister = async (req:any, res:any) => {
    try {
        let params = req.body
        console.log(params)
        const email = await UserSchema.findOne({ email: params.email })
        const mobile = await UserSchema.findOne({ mobile: params.mobile })
        if(email || mobile){
            res.status(401).send({message:"User Already Exist"})
        }else{
            const dbUser = new UserSchema({
                email: params.email,
                mobile: params.mobile,
                role: params.role,
                username: params.username,
                status: 'available'
            });
            try {
                const data = await dbUser.save();
                res.status(200).send({link: `${process.env.FRONT_URI}/register/${data._id}`})
            } catch (error: any) {
                res.status(400).send({message: error.message})
            }
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const getPreRegister = async (req:any, res:any) => {
    try {
        let params = req.query
        const user:{
            email: string,
            mobile: string,
            role: string,
            status: string,
        
        } | null = await UserSchema.findOne({ _id: new mongoose.Types.ObjectId(params._id) })
        if(user){
            res.status(200).send({data:user})
        }else{
            res.status(400).send({message: "User does not Exist"})
        }

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const register = async (req: any, res: any) => {
    try {
        let params:IUser = req.body
        if(params?._id){
            const hashedPassword = await bcrypt.hash(params.password.toString(), 10)
                const newUser :any = await UserSchema.findOneAndUpdate(
                    {_id: new mongoose.Types.ObjectId(params._id?.toString())},
                    {email: params.email,
                        address : params.address,
                        age : params.age,
                        password : hashedPassword,
                        birthdate : params.birthdate,
                        mobile : params.mobile,
                        username : params.username,
                        role : params.role,
                        gender: params.gender,
                        status: "available"}
                )
             res.status(200).send({newUser})
        }else{
            if(req.user.role === "admin"){
                const email: null | any = await UserSchema.findOne({ email: params.email })
                const mobile:  null | any = await UserSchema.findOne({ mobile: params.mobile })
                console.log(email)
                if(email || mobile){
                    res.status(400).send({message:"User Already Exist"})
                }else{
                    const hashedPassword = await bcrypt.hash(params.password.toString(), 10)
                    const newUser = new UserSchema({
                        email: params.email,
                        address : params.address,
                        age : params.age,
                        gender: params.gender,
                        password : hashedPassword,
                        birthdate : params.birthdate,
                        mobile : params.mobile,
                        username : params.username,
                        role : params.role,
                        status: "available"
                    });
                    const data = await newUser.save()
                    res.status(200).send({data})
                }
            }else{
                res.status(400).send({message:"Please Pre Register First"})
            }
        }

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const login = async (req: any, res: any) => {
    try {
        let params:any = req.body
        const user:IUser | null = await UserSchema.findOne({ email: params.email })
        console.log(user)
        if(user){
            const isMatch = await bcrypt.compare(params.password, user.password.toString())
            if(isMatch){
                const payload = {
                    id: user._id,
                    role: user.role,
                    gender: user.gender
                };
                jwt.sign(
                    payload,
                    `${process.env.JWT_SECRET}`,
                    { expiresIn: "12hr" },
                    async (err, token) => {
                        if(err){
                            res.status(400).send({message: err.message})
                        }else{
                            res.status(200).send({token: token})
                        }
                    }
                )  
            }else{
                res.status(400).send({ok:false, data:"Incorrect Email or Password" })
            }
        }else{
            res.status(400).send({message:"Incorrect Email or Password" })
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const getUsers = async (req:any, res:any) => {
    try {
        let params = req.query
        const users: IUser[] = await UserSchema.where({
            $or: [
                {$and : [
                    {role: params.role},
                    {'username.firstName': params.search}
                ]},
                {$and : [
                    {role: params.role},
                    {'username.lastName': params.search}
                ]},
                {$and : [
                    {role: params.role},
                    {'username.email': params.search}
                ]},
            ]
        })
        .sort(params.sort)
        .limit(params.limit)
        .select('_id username email contact role')
        console.log(users)
        res.status(200).send({data:users})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const getUserData = async (req:any, res:any) => {
    try {
        let params = req.query
        const user: IUser | null = await UserSchema.findOne({_id: params._id})
        const appointments: Array<Iappointment> = await AppointmentSchema.where({
            patient: new mongoose.Types.ObjectId(user?._id?.toString())
        })
        .populate('patient', 'username _id status mobile email')
        .populate('doctor', 'username _id status mobile email')
        res.status(200).send({data:{user, appointments}})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const updateUser = async (req: any, res: any) => {
    try {
        let params:IUser = req.body
        const newUser :any = await UserSchema.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(req.user.id?.toString())},
            {
                address : params.address,
                birthdate : params.birthdate,
                mobile : params.mobile,
                username : params.username,
                gender: params.gender,
                status: "available"
            }
        )
        res.status(200).send({newUser})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const updatePassword = async (req: any, res: any) => {
    try {
        let params:any = req.body
        const user:IUser| null = await UserSchema.findOne({_id : new mongoose.Types.ObjectId(req.user.id)})
        const isMatch = await bcrypt.compare(params.currentPassword, `${user?.password.toString()}`)
        if(isMatch){
            const hashedPassword = await bcrypt.hash(params.newPassword.toString(), 10)
            const result = await UserSchema.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.user.id)},
            {
                password: hashedPassword
            })
            res.status(200).send({data:result})
        }else{
            res.status(400).send({message:"Password Does not Match"})
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Password Does not Match"})
    }
}