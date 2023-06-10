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
const { Review } = require("../utils/schema");
const { validateApiKey } = require("../utils/middlewares");
const express = require("express");
const router = express.Router();
router.get("/", validateApiKey, (req, res) => {
    res.send("reviews!");
});
router.get("/:venue_id", validateApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const venueId = new mongoose_1.default.Types.ObjectId(req.params.venue_id);
        const reviews = yield Review.find({ venue: venueId });
        return res.status(200).json(reviews);
    }
    catch (error) {
        return res.status(501).json(error);
    }
}));
router.post("/", validateApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newReview = new Review(req.body);
        const savedReview = yield newReview.save();
        return res.status(201).json(savedReview);
    }
    catch (error) {
        return res.status(500).json(error);
    }
}));
router.patch("/:review_id", validateApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = new mongoose_1.default.Types.ObjectId(req.params.review_id);
        const updatedReview = yield Review.findByIdAndUpdate(id, req.body, {
            runValidators: true,
        });
        return res.status(200).json(updatedReview);
    }
    catch (error) {
        return res.status(500).json(error);
    }
}));
router.delete("/:review_id", validateApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = new mongoose_1.default.Types.ObjectId(req.params.review_id);
        const deletedReview = yield Review.findByIdAndDelete(reviewId);
        if (deletedReview) {
            res.json({ message: "Review deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Review not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting Review", error });
    }
}));
module.exports = router;
