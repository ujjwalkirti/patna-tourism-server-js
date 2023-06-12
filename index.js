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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("./utils/db"));
const body_parser_1 = __importDefault(require("body-parser"));
const { User, APIKeyModel } = require("./utils/schema");
const uuid_1 = require("uuid");
const { ensureAuthenticated } = require("./utils/middlewares");
const app = (0, express_1.default)();
const port = process.env.PORT;
const cors = require("cors");

// Parse JSON bodies
app.use(body_parser_1.default.json());
// Parse URL-encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
(0, db_1.default)();
// Enable CORS for all routes
app.use(cors());

//Routers
const venueRouter = require("./routers/venues");
const typeRouter = require("./routers/types");
const reviewRouter = require("./routers/reviews");
app.use("/venues", venueRouter);
app.use("/types", typeRouter);
app.use("/reviews", reviewRouter);
// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/get-api-key", ensureAuthenticated, (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Check if the user already has an existing API key
      const existingApiKey = yield APIKeyModel.findOne({
        //@ts-ignore
        userId: req.body?.uid,
      });
      if (existingApiKey) {
        // User already has an existing API key, return it
        return res.status(200).json({
          message: "You already have an existing API Key.",
          existingApiKey,
        });
      }
      // Generate a new API key
      const apiKey = (0, uuid_1.v4)();
      // Create a new APIKey document
      const newApiKey = {
        key: apiKey,
        //@ts-ignore
        userId: req.body?.uid,
      };
      // Save the APIKey document to the database
      const apiKeyDocument = new APIKeyModel(newApiKey);
      const savedApiKey = yield apiKeyDocument.save();
      return res.status(201).json(savedApiKey);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Sorry, something went wrong.", error });
    }
  })
);

app.post("/add-email", async (req, res) => {
  try {
    const newUser = new User(req.body.user);
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Sorry, something went wrong.", error });
  }
});

// Catch-all middleware for invalid endpoints
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
});
// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
process.on("SIGINT", () => {
  mongoose_1.default.connection.close().then(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});
