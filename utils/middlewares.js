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
Object.defineProperty(exports, "__esModule", { value: true });
const { APIKeyModel, User } = require("./schema");
// Middleware to validate API key
const validateApiKey = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = req.header("X-API-Key");
    // Check if API key exists in the database
    const result = yield APIKeyModel.findOne({ apiKey });
    if (!result) {
      return res.status(401).json({ message: "Invalid API key" });
    }
    // API key is valid, proceed to the next middleware or route handler
    next();
  });
// Middleware to ensure user is authenticated
async function ensureAuthenticated(req, res, next) {
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: "User is not authenticated" });
  }
  // User is not authenticated, send JSON response with error status
  next();
}
module.exports = { validateApiKey, ensureAuthenticated };
