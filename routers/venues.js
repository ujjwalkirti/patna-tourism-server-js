"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Venue, Review } = require("../utils/schema");
const express = require("express");
const router = express.Router();
const { validateApiKey } = require("../utils/middlewares");
router.get("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const venues = yield Venue.find({});
      return res.status(200).json(venues);
    } catch (error) {
      return res.status(500).json({
        message: "Error retrieving venues",
        error,
      });
    }
  })
);

router.get("/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const venues = await Venue.findById(id);
    return res.status(200).json(venues);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving venue with id:" + req.params.id,
      error,
    });
  }
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const id = new mongoose_1.Types.ObjectId(req.params.id);
    const reviews = await Review.find({ id });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving reviews for venue with id:" + req.params.id,
      error,
    });
  }
});

router.post("/", validateApiKey, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const newVenue = new Venue(req.body);
      const savedVenue = yield newVenue.save();
      return res.status(201).json(savedVenue);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Sorry, something went wrong.", error });
    }
  })
);
router.patch("/:id", validateApiKey, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const id = new mongoose_1.default.Types.ObjectId(req.params.id);
      const updatedVenue = yield Venue.findByIdAndUpdate(id, req.body, {
        runValidators: true,
      });
      return res.status(200).json(updatedVenue);
    } catch (error) {
      return res.status(500).json(error);
    }
  })
);
router.delete("/:id", validateApiKey, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const venueId = new mongoose_1.default.Types.ObjectId(req.params.id);
      const deletedVenue = yield Venue.findByIdAndDelete(venueId);
      if (deletedVenue) {
        res.json({ message: "Venue deleted successfully" });
      } else {
        res.status(404).json({ message: "Venue not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting venue", error });
    }
  })
);
module.exports = router;
