// routes/hydraulique.js

import express from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { authMiddleware, isAdmin } from "../middlewares/AuthVerify.js";
import {
  creerProduitHydraulique,
  obtenirProduitsHydrauliques,
  obtenirProduitHydrauliqueParId,
  supprimerProduitHydraulique
} from "../controllers/ControleurProduitHydraulique.js";

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

// Routes publiques pour équipements hydrauliques
router.get("/",    obtenirProduitsHydrauliques);
router.get("/:id", obtenirProduitHydrauliqueParId);

// Routes admin pour équipements hydrauliques
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload,
  creerProduitHydraulique
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  supprimerProduitHydraulique
);

export default router;
