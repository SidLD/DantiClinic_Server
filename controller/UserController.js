"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorIntro = exports.getUserRecord = exports.uploadProfile = exports.updatePassword = exports.updateUser = exports.getUserData = exports.getUsers = exports.login = exports.register = exports.getPreRegister = exports.generatePIN = exports.preRegister = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema_1 = __importDefault(require("../schema/UserSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppointmentSchema_1 = __importDefault(require("../schema/AppointmentSchema"));
const preRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        console.log(params);
        const email = yield UserSchema_1.default.findOne({ email: params.email });
        const mobile = yield UserSchema_1.default.findOne({ mobile: params.mobile });
        if (email || mobile) {
            res.status(401).send({ message: "User Already Exist" });
        }
        else {
            const randomPIN = ("0" + Math.floor(Math.random() * (9999 - 0 + 1)) + 0).substr(-4);
            const dbUser = new UserSchema_1.default({
                email: params.email,
                mobile: params.mobile,
                role: params.role,
                username: params.username,
                status: 'available',
                PIN: `${randomPIN}`
            });
            try {
                const data = yield dbUser.save();
                res.status(200).send({ link: `http://danteclinic.online/register/${data._id}`, PIN: `${randomPIN}` });
            }
            catch (error) {
                res.status(400).send({ message: error.message });
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.preRegister = preRegister;
const generatePIN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const randomPIN = ("0" + Math.floor(Math.random() * (9999 - 0 + 1)) + 0).substr(-4);
        const insertPIN = yield UserSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.user.id) }, { PIN: `${randomPIN}` });
        res.status(200).send({ data: { email: insertPIN === null || insertPIN === void 0 ? void 0 : insertPIN.email, PIN: randomPIN } });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "ERROR when generating PIN" });
    }
});
exports.generatePIN = generatePIN;
const getPreRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.query;
        const user = yield UserSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(params._id) });
        if (user) {
            res.status(200).send({ data: user });
        }
        else {
            res.status(400).send({ message: "User does not Exist" });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.getPreRegister = getPreRegister;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let params = req.body;
        if (params === null || params === void 0 ? void 0 : params._id) {
            const user = yield UserSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(params._id.toString()) });
            if ((user === null || user === void 0 ? void 0 : user.PIN) == params.PIN) {
                const hashedPassword = yield bcrypt_1.default.hash(params.password.toString(), 10);
                const newUser = yield UserSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId((_a = params._id) === null || _a === void 0 ? void 0 : _a.toString()) }, { email: params.email,
                    address: params.address,
                    age: params.age,
                    password: hashedPassword,
                    birthdate: params.birthdate,
                    mobile: params.mobile,
                    username: params.username,
                    role: params.role,
                    gender: params.gender,
                    status: "available" });
                res.status(200).send({ newUser });
            }
            else {
                res.status(400).send({ message: 'Incorrect PIN' });
            }
        }
        else {
            console.log(params.role);
            if (params.role === "doctor") {
                const email = yield UserSchema_1.default.findOne({ email: params.email, role: 'doctor' });
                const mobile = yield UserSchema_1.default.findOne({ mobile: params.mobile, role: 'doctor' });
                console.log("sdasdasd", email, mobile);
                if (email || mobile) {
                    res.status(400).send({ message: "User Already Exist" });
                }
                else {
                    const hashedPassword = yield bcrypt_1.default.hash(params.password.toString(), 10);
                    const newUser = new UserSchema_1.default({
                        email: params.email,
                        address: params.address,
                        age: params.age,
                        gender: params.gender,
                        password: hashedPassword,
                        birthdate: params.birthdate,
                        mobile: params.mobile,
                        username: params.username,
                        role: 'doctor',
                        specialty: (params === null || params === void 0 ? void 0 : params.specialty) || "",
                        status: "available"
                    });
                    const data = yield newUser.save();
                    res.status(200).send({ data });
                }
            }
            else {
                res.status(400).send({ message: "Please Pre Register First" });
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        const user = yield UserSchema_1.default.findOne({ email: params.email });
        console.log(user);
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(params.password, user.password.toString());
            if (isMatch) {
                const payload = {
                    id: user._id,
                    role: user.role,
                    gender: user.gender,
                    firstName: user.username.firstName,
                    lastName: user.username.lastName
                };
                jsonwebtoken_1.default.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "12hr" }, (err, token) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        res.status(400).send({ message: err.message });
                    }
                    else {
                        res.status(200).send({ token: token });
                    }
                }));
            }
            else {
                res.status(400).send({ ok: false, data: "Incorrect Email or Password" });
            }
        }
        else {
            res.status(400).send({ message: "Incorrect Email or Password" });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.login = login;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.query;
        const users = yield UserSchema_1.default.where({
            $or: [
                { 'username.lastName': { $regex: '.*' + params.search + '.*' } },
                { 'username.firstName': { $regex: '.*' + params.search + '.*' } },
                { 'username.email': { $regex: '.*' + params.search + '.*' } }
            ],
            $and: [
                { role: params.role }
            ]
        })
            .sort(params.sort)
            .limit(params.limit)
            .select('_id username email contact role');
        console.log(users);
        res.status(200).send({ data: users });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.getUsers = getUsers;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        let params = req.query;
        const user = yield UserSchema_1.default.findOne({ _id: params._id }).populate('profile');
        const appointments = yield AppointmentSchema_1.default.where({
            patient: new mongoose_1.default.Types.ObjectId((_b = user === null || user === void 0 ? void 0 : user._id) === null || _b === void 0 ? void 0 : _b.toString())
        })
            .populate('patient', 'username _id status mobile email')
            .populate('doctor', 'username _id status mobile email');
        res.status(200).send({ data: { user, appointments } });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.getUserData = getUserData;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        let params = req.body;
        const newUser = yield UserSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId((_c = req.user.id) === null || _c === void 0 ? void 0 : _c.toString()) }, {
            address: params.address,
            birthdate: params.birthdate,
            mobile: params.mobile,
            username: params.username,
            gender: params.gender,
            status: params.status
        });
        res.status(200).send({ newUser });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.updateUser = updateUser;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        console.log(params);
        const user = yield UserSchema_1.default.findOne({
            $and: [
                { _id: new mongoose_1.default.Types.ObjectId(req.user.id) },
                { PIN: params.PIN }
            ]
        });
        console.log(new mongoose_1.default.Types.ObjectId(req.user.id), params.PIN);
        if (user) {
            const hashedPassword = yield bcrypt_1.default.hash(params.newPassword.toString(), 10);
            const result = yield UserSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.user.id) }, {
                password: hashedPassword
            });
            res.status(200).send({ data: result });
        }
        else {
            res.status(400).send({ message: "Account Does Not Exist" });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Password Does not Match" });
    }
});
exports.updatePassword = updatePassword;
const uploadProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        const { name, fullPath, contentType } = params.metadata;
        const { path_ } = params.ref._location;
        const response = yield UserSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(req.user.id) }, {
            profile: {
                name: name,
                path: path_,
                fullPath: fullPath,
                imageType: contentType
            }
        });
        res.status(200).send({ message: "Success" });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Password Does not Match" });
    }
});
exports.uploadProfile = uploadProfile;
const getUserRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const userData = yield UserSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(params._id),
            'address': { $ne: null }
        })
            .sort(params.sort)
            .limit(params.limit)
            .select(['_id', 'username', 'role', 'email', 'mobile', 'status', 'address', 'gender', 'birthdate', 'profile']);
        const appointments = yield AppointmentSchema_1.default.where({
            patient: userData === null || userData === void 0 ? void 0 : userData._id,
            status: 'complete'
        })
            .populate('doctor', '_id username mobile email');
        res.status(200).send({ data: { user: userData, appointments } });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Server Error" });
    }
});
exports.getUserRecord = getUserRecord;
const getDoctorIntro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield UserSchema_1.default.where({
            role: 'doctor',
            status: 'available'
        })
            .populate('profile')
            .select('username _id gender specialty');
        res.status(200).send({ data: doctors });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Server Error" });
    }
});
exports.getDoctorIntro = getDoctorIntro;
