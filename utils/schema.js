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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
// Define the user schema
const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});
const venueSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
        max: 10,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        default: "",
    },
});
const reviewSchema = new mongoose.Schema({
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});
const userSchema = new mongoose_1.Schema({
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
});
// Assuming your User model extends the mongoose.Model class
userSchema.methods.serializeUser = function () {
    return this._id; // Serialize the user object by returning the user ID
};
userSchema.statics.deserializeUser = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findById(id); // Deserialize the user object by querying the database using the user ID
    });
};
const apiKeySchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    userId: { type: String, required: true },
});
// Create the User model based on the user schema
const Type = mongoose.model("Type", typeSchema);
const Venue = mongoose.model("Venue", venueSchema);
const Review = mongoose.model("Review", reviewSchema);
const User = (0, mongoose_1.model)("User", userSchema);
const APIKeyModel = (0, mongoose_1.model)("APIKey", apiKeySchema);
module.exports = { Type, Venue, Review, User, APIKeyModel };
