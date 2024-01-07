"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const verify_1 = require("../util/verify");
const AnalysisController_1 = require("../controller/AnalysisController");
dotenv_1.default.config();
const analysisAPI = (0, express_1.default)();
const apiVersion = process.env.API_VERSION;
analysisAPI.get(`/${apiVersion}/user-summary`, verify_1.verifyToken, AnalysisController_1.getUserSummary);
analysisAPI.get(`/${apiVersion}/appointment-status-count`, verify_1.verifyToken, AnalysisController_1.getCountAllStatus);
analysisAPI.get(`/${apiVersion}/appointment-status-date`, verify_1.verifyToken, AnalysisController_1.getAppintmentsInDate);
analysisAPI.get(`/${apiVersion}/appointment-backup`, verify_1.verifyToken, AnalysisController_1.getAppointmentsData);
exports.default = analysisAPI;
