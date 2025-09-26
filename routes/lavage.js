import express from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { authMiddleware, isAdmin } from "../middlewares/AuthVerify.js";
import {
  creerProduitLavage,
  getLavages,
  getLavageById,
  deleteLavage,
} from "../controllers/ControleurProduitLavage.js";

const router = express.Router();

// 1. Définir où Multer stocke les fichiers
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

// Routes publiques
router.get("/", getLavages);
router.get("/:id", getLavageById);

// Routes protégées (admin)
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload, // Multer pour parser multipart/form-data
  creerProduitLavage
);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  deleteLavage
);

export default router;
