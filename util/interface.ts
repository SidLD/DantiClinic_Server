
export interface IUser {
    _id: String | undefined,
    profile: Iimg,
    PIN: string,
    specialty?:string,
    username:{
        firstName: String,
        middleName?: String,
        lastName: String,
    },
    appointments: Array<Iappointment>,
    email: String,
    password: String,
    mobile: String,
    birthdate: String,
    age: Number,
    gender: string,
    address: {
        city: {
            code: string,
            label:String
        },
        province: {
            code: string,
            label:String
        },
    },
    role: 'admin' | 'patient' | 'doctor',
    status: 'available' | 'unavailable',
}

export interface Ilog {
    user: IUser,
    detail: String,
    createdAt: Date,
    updatedAt: Date,
}

export interface Iappointment {
    _id: String | undefined,
    title: string
    patient: IUser
    doctor: IUser
    date: Date
    status: 'approve' | 'pending' | 'reject'
    findings?: {
        detail: string,
        date: Date
    }
    log: Array<Ilog>
}

export interface Iimg {
    _id: String | undefined,
    user: IUser,
    path: string,
    name: string,
    imageType: string
    fullPath: string
}