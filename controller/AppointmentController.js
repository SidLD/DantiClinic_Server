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
exports.getRecords = exports.completeAppointment = exports.rejectAppointment = exports.deleteAppointment = exports.updateAppointment = exports.getAppointmentForPDF = exports.getOneAppointment = exports.getAppointment = exports.createAppointment = void 0;
const UserSchema_1 = __importDefault(require("../schema/UserSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppointmentSchema_1 = __importDefault(require("../schema/AppointmentSchema"));
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.body;
        if (req.user.role === 'admin') {
            const newAppointment = yield AppointmentSchema_1.default.create({
                patient: new mongoose_1.default.Types.ObjectId(params.patient),
                doctor: new mongoose_1.default.Types.ObjectId(params.doctor),
                status: params.status,
                title: params.title,
                date: new Date(params.date)
            });
            res.status(200).send({ message: newAppointment });
        }
        else {
            const newAppointment = yield AppointmentSchema_1.default.create({
                patient: new mongoose_1.default.Types.ObjectId(req.user.id),
                doctor: new mongoose_1.default.Types.ObjectId(params.doctor),
                status: params.status,
                title: params.title,
                date: new Date(params.date),
                log: [{
                        user: new mongoose_1.default.Types.ObjectId(req.user.id),
                        detail: "Create Appointment"
                    }]
            });
            res.status(200).send({ message: newAppointment });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.createAppointment = createAppointment;
const getAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        if (req.user.role === 'patient') {
            const appointments = yield AppointmentSchema_1.default.where({
                $or: [
                    { 'patient.username.firstName': params.search },
                    { 'patient.username.lastName': params.search },
                    { 'patient.username.email': params.search },
                    { 'doctor.username.firstName': params.search },
                    { 'doctor.username.lastName': params.search },
                    { 'doctor.username.email': params.search },
                    { 'title': { $regex: '.*' + params.search + '.*' } },
                ],
                patient: new mongoose_1.default.Types.ObjectId(req.user.id)
            })
                .collation({ locale: "en" })
                .sort(params.sort)
                .limit(params.limit)
                .populate('patient', 'username _id status mobile email')
                .populate('doctor', 'username _id status mobile email');
            res.status(200).send({ data: appointments });
        }
        else if (req.user.role == 'doctor') {
            const appointments = yield AppointmentSchema_1.default.where({
                $or: [
                    { 'patient.username.firstName': params.search },
                    { 'patient.username.lastName': params.search },
                    { 'patient.username.email': params.search },
                    { 'doctor.username.firstName': params.search },
                    { 'doctor.username.lastName': params.search },
                    { 'doctor.username.email': params.search },
                    { 'title': { $regex: '.*' + params.search + '.*' } },
                ],
                status: { $ne: 'complete' },
                doctor: new mongoose_1.default.Types.ObjectId(req.user.id)
            })
                .collation({ locale: "en" })
                .sort(params.sort)
                .limit(params.limit)
                .populate('patient', 'username _id status mobile email')
                .populate('doctor', 'username _id status mobile email');
            res.status(200).send({ data: appointments });
        }
        else {
            const appointments = yield AppointmentSchema_1.default.where({
                $or: [
                    { 'patient.username.firstName': params.search },
                    { 'patient.username.lastName': params.search },
                    { 'patient.username.email': params.search },
                    { 'doctor.username.firstName': params.search },
                    { 'doctor.username.lastName': params.search },
                    { 'doctor.username.email': params.search },
                    { 'title': { $regex: '.*' + params.search + '.*' } },
                ],
                status: { $ne: 'complete' },
            })
                .collation({ locale: "en" })
                .sort(params.sort)
                .limit(params.limit)
                .populate('patient', 'username _id status mobile email')
                .populate('doctor', 'username _id status mobile email');
            res.status(200).send({ data: appointments });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.getAppointment = getAppointment;
const getOneAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const appointment = yield AppointmentSchema_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(params.appointmentId)
        })
            .populate('patient', 'username _id status mobile email  address gender contact birthdate')
            .populate('doctor', 'username _id status mobile email  address gender contact birthdate');
        res.status(200).send({ data: appointment });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.getOneAppointment = getOneAppointment;
const getAppointmentForPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.query;
        const appointments = yield AppointmentSchema_1.default.where({
            patient: new mongoose_1.default.Types.ObjectId(params.patientId)
        })
            .populate('patient', 'username _id status mobile email address gender contact birthdate')
            .populate('doctor', 'username _id status mobile email address gender contact birthdate');
        res.status(200).send({ data: {
                user: appointments[0].patient,
                appointments: appointments
            } });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.getAppointmentForPDF = getAppointmentForPDF;
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.body;
        const appointment = yield AppointmentSchema_1.default.findById(new mongoose_1.default.Types.ObjectId(params._id));
        if (req.user.role == 'admin') {
            const result = yield AppointmentSchema_1.default.findOneAndUpdate(new mongoose_1.default.Types.ObjectId(params._id), { date: new Date(params.date), title: params.title, status: 'approve' }).populate('patient');
            res.status(200).send({ data: result });
        }
        else if (req.user.role == 'doctor') {
            const result = yield AppointmentSchema_1.default.findOneAndUpdate(new mongoose_1.default.Types.ObjectId(params._id), { date: new Date(params.date), title: params.title, status: 'approve' }).populate('patient');
            res.status(200).send({ data: result });
        }
        else if (req.user.role === 'patient' && (appointment === null || appointment === void 0 ? void 0 : appointment.status) === 'pending') {
            const result = yield AppointmentSchema_1.default.findOneAndUpdate(new mongoose_1.default.Types.ObjectId(params._id), { date: new Date(params.date), title: params.title }).populate('patient');
            res.status(200).send({ data: result });
        }
        else {
            res.status(400).send({ message: "Access Denied" });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.updateAppointment = updateAppointment;
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.body;
        const appointment = yield AppointmentSchema_1.default.findByIdAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(params._id),
            patient: new mongoose_1.default.Types.ObjectId(req.user._id),
        });
        res.status(200).send({ data: appointment });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.deleteAppointment = deleteAppointment;
const rejectAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.body;
        const appointment = yield AppointmentSchema_1.default.findOneAndUpdate(new mongoose_1.default.Types.ObjectId(params._id), {
            status: 'reject'
        });
        res.status(200).send({ data: appointment });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.rejectAppointment = rejectAppointment;
const completeAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.body;
        const result = yield AppointmentSchema_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(params._id) }, {
            findings: params.findings,
            status: 'complete'
        });
        res.status(200).send({ data: result });
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Email Already Taken" });
    }
});
exports.completeAppointment = completeAppointment;
const getRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const params = req.query;
        if (req.user.role == 'patient') {
            const users = yield UserSchema_1.default.where({
                _id: new mongoose_1.default.Types.ObjectId(req.user.id)
            })
                .sort(params.sort)
                .limit(params.limit)
                .select(['_id', 'username', 'role', 'email', 'mobile', 'status']);
            res.status(200).send({ data: users });
        }
        else {
            const tempUsers = yield UserSchema_1.default.where({
                $or: [
                    { 'username.firstName': { '$regex': params.search, '$options': 'i' }
                    },
                    { 'username.lastName': { '$regex': params.search, '$options': 'i' }
                    },
                ],
            });
            const users = yield AppointmentSchema_1.default.where({
                date: {
                    $gte: new Date(((_a = params.date) === null || _a === void 0 ? void 0 : _a.from) || new Date() + ".000+00:00"),
                    $lte: new Date(((_b = params.date) === null || _b === void 0 ? void 0 : _b.to) || new Date() + ".000+00:00")
                },
                patient: {
                    $in: tempUsers.map(element => element._id)
                }
            })
                .sort(params.sort)
                .limit(params.limit)
                .populate('patient', ['_id', 'username', 'role', 'email', 'mobile', 'status']);
            let result = [];
            users.forEach(element => {
                if (!result.includes(element.patient)) {
                    result.push(element.patient);
                }
            });
            res.status(200).send({ data: result });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send({ message: "Invalid Data or Server Error" });
    }
});
exports.getRecords = getRecords;
