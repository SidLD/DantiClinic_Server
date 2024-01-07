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
exports.getAppointmentsData = exports.getAppintmentsInDate = exports.getUserSummary = exports.getCountAllStatus = void 0;
const UserSchema_1 = __importDefault(require("../schema/UserSchema"));
const AppointmentSchema_1 = __importDefault(require("../schema/AppointmentSchema"));
const getCountAllStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const approve = yield AppointmentSchema_1.default.where({ status: 'approved' }).count();
        const forAdmin = yield AppointmentSchema_1.default.where({ status: 'forAdmin' }).count();
        const forDoctor = yield AppointmentSchema_1.default.where({ status: 'forDoctor' }).count();
        const complete = yield AppointmentSchema_1.default.where({ status: 'complete' }).count();
        const reject = yield AppointmentSchema_1.default.where({ status: 'reject' }).count();
        const data = {
            approve, forAdmin, forDoctor, complete, reject
        };
        res.status(200).send(data);
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Server Error" });
    }
});
exports.getCountAllStatus = getCountAllStatus;
const getUserSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const patientCount = yield UserSchema_1.default.where({ role: 'patient' }).count();
        const totalDoctorCount = yield UserSchema_1.default.where({ role: 'doctor' }).count();
        const doctorCount = yield UserSchema_1.default.where({ status: 'available', role: 'doctor' }).count();
        const data = {
            patientCount, doctorCount, totalDoctorCount
        };
        res.status(200).send(data);
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Server Error" });
    }
});
exports.getUserSummary = getUserSummary;
const getAppintmentsInDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const appointmentCount = yield AppointmentSchema_1.default.find({
            createdAt: {
                $gte: new Date(params.dateOne),
                $lt: new Date(params.dateTwo)
            }
        }).count();
        const userCount = yield UserSchema_1.default.find({
            role: 'patient',
            createdAt: {
                $gte: new Date(params.dateOne),
                $lt: new Date(params.dateTwo)
            }
        }).count();
        res.status(200).send({ data: { appointmentCount, userCount } });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Server Error" });
    }
});
exports.getAppintmentsInDate = getAppintmentsInDate;
const getAppointmentsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const data = yield AppointmentSchema_1.default.where({})
            .populate('doctor', 'username')
            .populate('patient', 'username');
        res.status(200).send({ data: data });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Server Error" });
    }
});
exports.getAppointmentsData = getAppointmentsData;
