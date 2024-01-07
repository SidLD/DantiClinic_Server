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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//functions
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield req.headers['x-access-token'].split(' ')[1];
        req.user = {};
        if (token) {
            jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    return res.json({
                        isLoggingIn: false,
                        message: "Failed to Authenticate",
                        err: err
                    });
                req.user.id = decoded.id;
                req.user.firstName = decoded.firstName;
                req.user.lastName = decoded.lastName;
                req.user.role = decoded.role;
                next();
            }));
        }
        else {
            res.status(406).json({ message: "Token Not Acceptable" });
        }
    }
    catch (error) {
        res.status(406).json({ message: "Token Not Acceptable" });
    }
});
exports.verifyToken = verifyToken;
