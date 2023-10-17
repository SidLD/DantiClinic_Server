import { Schema, model } from "mongoose";
import { IUser } from "../util/interface";

const userSchema = new Schema<IUser>(
  {
    username: {
      firstName:String,
      lastName:String,
      middleName: String,
    },
    password: String,
    email: String,
    mobile: String,
    birthdate:{
      city: String,
      province: String,
      country: String,
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    address: {
      city: String,
      province: String,
      country: String,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: ["admin", "doctor", "patient"],
    },
    status: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: ["pending", "approved"],
    }
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);