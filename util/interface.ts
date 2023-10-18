
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
        city: String,
        province: String,
    },
    role: 'admin' | 'patient' | 'doctor',
    status: 'pending' | 'approve',
}

export interface Iappointment {
    _id: String | undefined,
    patient: IUser,
    doctor: IUser
}