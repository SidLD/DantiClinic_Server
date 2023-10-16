import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserSchema from '../schema/UserSchema'

export const register = async (req:any, res:any) => {
    try {
        let params = req.body
        console.log(params)
        // const user = await UserSchema.findOne({ email: params.email })
        // if(user){
        //     res.status(401).send({message:"User Already Exist"})
        // }else{
        //     const hashedPassword = await bcrypt.hash(params.password, 10);
        //     const dbUser = new UserSchema({
        //         firstName: params.firstName,
        //         lastName: params.lastName,
        //         email: params.email,
        //         password: hashedPassword,
        //         role: params.role,
        //     });
        //     try {
        //         const data = await dbUser.save();
        //         res.status(200).send({data})
        //     } catch (error: any) {
        //         res.status(400).send({message: error.message})
        //     }
        // }
        res.status(200).send({ok:true,message: "Invalid Data or Email Already Taken"})

    } catch (error) {
        console.log(error)
        res.status(400).send({ok:false,message: "Invalid Data or Email Already Taken"})
    }
}