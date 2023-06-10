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
const mongoose_1 = __importDefault(require("mongoose"));
const db_password = process.env.DB_PASSWORD;
let connectUrl = "";
if (process.env.NODE_ENV === "production") {
    connectUrl =
        "mongodb+srv://ujjwal_kirti493625:" +
            db_password +
            "@cluster0.ejnwur1.mongodb.net/?retryWrites=true&w=majority";
}
else {
    connectUrl = "mongodb://127.0.0.1:27017/patna-tourism-api";
}
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Replace 'mongodb+srv://<username>:<password>@<cluster-url>/<database-name>' with your MongoDB connection string
        yield mongoose_1.default.connect(connectUrl, {
            // @ts-ignore
            useNewUrlParser: true,
            // @ts-ignore
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
});
exports.default = connectDB;
