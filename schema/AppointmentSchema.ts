import mongoose, { Schema, model } from "mongoose";
import { IUser, Iappointment, Ilog } from "../util/interface";

const logSchema = new Schema<Ilog>(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      detail: String,
    },
    { timestamps: true }
  );

const appointmentSchema = new Schema<Iappointment>(
  {
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    date: Date,
    status: {
      type: String,
      enum: [ 'pending' , 'approved', 'reject']
    },
    findings: {
        detail: String,
        date: Date
    },
    log: [logSchema]
  },
  {
    timestamps: true,
  }
);

export default model<Iappointment>("Appointment", appointmentSchema);