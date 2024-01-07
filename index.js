"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const UserAPI_1 = __importDefault(require("./api/UserAPI"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppointmentAPI_1 = __importDefault(require("./api/AppointmentAPI"));
const AnalysisAPI_1 = __importDefault(require("./api/AnalysisAPI"));
//For env File 
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8888;
const urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.use(body_parser_1.default.json(), urlencodedParser);
const corsOptions = {
    origin: process.env.FRONT_URI // frontend URI (ReactJS)
};
app.use((0, cors_1.default)(corsOptions));
//START of API
app.use(UserAPI_1.default);
app.use(AppointmentAPI_1.default);
app.use(AnalysisAPI_1.default);
//END of API
app.post('*', (req, res) => {
    res.status(404).send({ message: "URI not FOUND" });
});
app.get('*', (req, res) => {
    res.status(404).send({ message: "URI not FOUND" });
});
app.put('*', (req, res) => {
    res.status(404).send({ message: "URI not FOUND" });
});
app.delete('*', (req, res) => {
    res.status(404).send({ message: "URI not FOUND" });
});
//Database
try {
    mongoose_1.default.set("strictQuery", false);
    mongoose_1.default.connect(`${process.env.ATLAS_URI}`);
    console.log(`Connected to Database ${`${process.env.ATLAS_URI}`}`);
}
catch (error) {
    console.log(error);
}
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
