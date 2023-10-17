import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserSchema from '../schema/UserSchema'
import { IUser } from '../util/interface'
import mongoose from 'mongoose'

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
                role: params.role
            });
            try {
                const data = await dbUser.save();
                res.status(200).send({data})
            } catch (error: any) {
                res.status(400).send({message: error.message})
            }
        }

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const register = async (req: any, res: any) => {
    try {
        let params:IUser = req.body
        //To avoid duplication I manually called email and username
        //If email or username is found, there should be an ID in the params, otherwise its an illegal query
        const email = await UserSchema.findOne({ email: params.email })
        const username = await UserSchema.findOne({ 
            'username.firstName': params?.username?.firstName, 
            'username.lastName': params?.username?.lastName
        })
        if(!email || !username){
            if(params._id){
                const hashedPassword = await bcrypt.hash(params.password.toString(), 10)
                let newUser : any = await UserSchema.find({_id: new mongoose.Types.ObjectId(params._id.toString())})
                .updateOne({}, {
                    address : params.address,
                    age : params.age,
                    password : hashedPassword,
                    birthdate : params.birthdate,
                    username : params.username,
                    role : params.role
                })
                res.status(200).send({newUser})
            }else{
                const hashedPassword = await bcrypt.hash(params.password.toString(), 10)
                let newUser : any = await UserSchema.create({
                    email: params.email,
                    address : params.address,
                    age : params.age,
                    password : hashedPassword,
                    birthdate : params.birthdate,
                    mobile : params.mobile,
                    username : params.username,
                    role : params.role
                })
                res.status(200).send({newUser})
            }
        }else{
            res.status(400).send({message:"User Already Exist"})
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