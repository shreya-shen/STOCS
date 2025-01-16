import { Router, Request, Response } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const router = Router();
const tokenFilePath = path.join(__dirname, "../../data/tokens.json");

const generateToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

const hashToken = (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

router.post("/generate", (req, res) => {
    const token = generateToken();
    const hashedToken = hashToken(token);

    let tokens: Record<string, string> = {};
    if (fs.existsSync(tokenFilePath)) {
        tokens = JSON.parse(fs.readFileSync(tokenFilePath, "utf-8"));
    }
    tokens[hashedToken] = token;
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokens));

    res.json({ token });
});

router.get("/:hash", (req: Request, res: Response) => {
    const hash = req.params.hash;

    if (fs.existsSync(tokenFilePath)) {
        const tokens = JSON.parse(fs.readFileSync(tokenFilePath, "utf-8"));
        if (tokens[hash]) {
            res.json({ token: tokens[hash] });
            return;
        }
    }
    res.status(404).json({ error: "Token not found" });
    return;
});

export default router;
