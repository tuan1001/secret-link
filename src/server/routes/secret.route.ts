import express from "express";
import { createSecret, viewSecret } from "../services/secret.service.js";

const router = express.Router();

router.post("/create", (req, res) => {
  try {
    const { secret, password } = req.body;

    const token = createSecret(secret, password);

    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/view/:token", (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;

    const result = viewSecret(token, password);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;