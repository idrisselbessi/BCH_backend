// src/routes/incendie.js

import express from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { authMiddleware, isAdmin } from "../middlewares/AuthVerify.js";
import {
  creerIncendie,
  getIncendies,
  getIncendieById,
  deleteIncendie,
} from "../controllers/ControleurIncendie.js";

const router = express.Router();

// 1. Multter : où stocker l’image/pdf
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    cb(null, join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPES[file.mimetype];
    cb(null, `${file.fieldname}_${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

// → Routes publiques “Incendie”
router.get("/", getIncendies);
router.get("/:id", getIncendieById);

// → Routes admin “Incendie”
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload,
  creerIncendie
);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  deleteIncendie
);

export default router;
