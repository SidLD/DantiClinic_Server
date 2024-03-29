import mongoose, { Schema, model } from "mongoose";
import { IUser, Iimg } from "../util/interface";

const profileSchema = new Schema<Iimg>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    imageType: String,
    path: String,
    name: String,
    fullPath: String
  },
  { timestamps: true }
);


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
    specialty: String,
    age: Number,
    gender:String,
    address: {
      city: {
        code:String,
        label:String
      },
      province:  {
        code:String,
        label:String
      },
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
      enum: ["pending", "approved", 'available', 'unavailable'],
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      }
    ],
    PIN: String,
    profile: profileSchema,
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);