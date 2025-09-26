// routes/petrolier.js

import express from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { authMiddleware, isAdmin } from "../middlewares/AuthVerify.js";
import {
  creerProduitPetrolier,
  obtenirProduitsPetroliers,
  obtenirProduitPetrolierParId,
  supprimerProduitPetrolier
} from "../controllers/ControleurProduitPetrolier.js";

const MIME_TYPES = {
  "image/jpg":       "jpg",
  "image/jpeg":      "jpg",
  "image/png":       "png",
  "application/pdf": "pdf"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    cb(null, join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPES[file.mimetype];
    cb(null, `${file.fieldname}_${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "pdf",   maxCount: 1 }
]);

const router = express.Router();

// Routes publiques pour équipements pétroliers
router.get("/",    obtenirProduitsPetroliers);
router.get("/:id", obtenirProduitPetrolierParId);

// Routes admin pour équipements pétroliers
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload,
  creerProduitPetrolier
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  supprimerProduitPetrolier
);

export default router;
