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
      enum: ["pending", "approve"],
    }
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);