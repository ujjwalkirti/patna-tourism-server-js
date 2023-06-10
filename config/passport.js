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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const mongoose_1 = require("mongoose");
const { User } = require("../utils/schema"); // Import the User model
// Configure Passport.js Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if the user already exists in the database
        let user = yield User.findOne({ googleId: profile.id });
        if (!user) {
            // Create a new user if it's their first-time sign-up
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails && ((_a = profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value),
            });
            yield user.save();
        }
        // Pass the user to the next middleware or callback
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    // Deserialize the user object by finding the user based on the unique identifier
    User.findById(id)
        .then((user) => {
        if (!user) {
            // If the user is not found, handle the error
            return done(new mongoose_1.Error("User not found"));
        }
        // Pass the deserialized user object to the done function
        done(null, user);
    })
        .catch((error) => {
        // Handle any errors that occur during deserialization
        done(error);
    });
});
