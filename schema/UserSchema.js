"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const profileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    imageType: String,
    path: String,
    name: String,
    fullPath: String
}, { timestamps: true });
const userSchema = new mongoose_1.Schema({
    username: {
        firstName: String,
        lastName: String,
        middleName: String,
    },
    password: String,
    email: String,
    mobile: String,
    birthdate: {
        city: String,
        province: String,
        country: String,
    },
    specialty: String,
    age: Number,
    gender: String,
    address: {
        city: {
            code: String,
            label: String
        },
        province: {
            code: String,
            label: String
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
        enum: ["pending", "approve", 'available', 'unavailable'],
    },
    appointments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Appointment",
        }
    ],
    PIN: String,
    profile: profileSchema,
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("User", userSchema);
