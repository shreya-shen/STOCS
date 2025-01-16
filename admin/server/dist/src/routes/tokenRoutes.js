"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const tokenFilePath = path_1.default.join(__dirname, "../../data/tokens.json");
const generateToken = () => {
    return crypto_1.default.randomBytes(32).toString("hex");
};
const hashToken = (token) => {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
};
router.post("/generate", (req, res) => {
    const token = generateToken();
    const hashedToken = hashToken(token);
    let tokens = {};
    if (fs_1.default.existsSync(tokenFilePath)) {
        tokens = JSON.parse(fs_1.default.readFileSync(tokenFilePath, "utf-8"));
    }
    tokens[hashedToken] = token;
    fs_1.default.writeFileSync(tokenFilePath, JSON.stringify(tokens));
    res.json({ token });
});
router.get("/:hash", (req, res) => {
    const hash = req.params.hash;
    if (fs_1.default.existsSync(tokenFilePath)) {
        const tokens = JSON.parse(fs_1.default.readFileSync(tokenFilePath, "utf-8"));
        if (tokens[hash]) {
            res.json({ token: tokens[hash] });
            return;
        }
    }
    res.status(404).json({ error: "Token not found" });
    return;
});
exports.default = router;
