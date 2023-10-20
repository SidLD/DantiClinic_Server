
export interface IUser {
    _id: String | undefined,
    username:{
        firstName: String,
        middleName?: String,
        lastName: String,
    },
    email: String,
    password: String,
    mobile: String,
    birthdate: String,
    age: Number,
    gender: 'male' | 'female',
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
    user?: IUser
    doctor: IUser
    date: Date
    status: 'forAdmin' | 'forDoctor' | 'approve' 
    findings?: {
        detail: string,
        date: Date
    }
    log: Array<Ilog>
}

export interface Iappointment {
    _id: String | undefined,
    patient: IUser,
    doctor: IUser
}