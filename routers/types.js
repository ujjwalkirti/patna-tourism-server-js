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
const { Venue, Type } = require("../utils/schema");
const { validateApiKey } = require("../utils/middlewares");
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield Type.find({});
        res.json(types);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving types.", error });
    }
}));
router.get("/:type/venues", validateApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        // Query the "venues" collection using Mongoose
        const venues = yield Venue.find({ type });
        return res.json(venues);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error retrieving venues.", error });
    }
}));
//add types
router.post("/", validateApiKey, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const newType = new Type({
            name: name,
        });
        const savedType = yield newType.save();
        return res.status(201).json(savedType);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Sorry, something went wrong.", error });
    }
}));
module.exports = router;
