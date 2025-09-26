// routes/tuyauterie.js

import express from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { authMiddleware, isAdmin } from "../middlewares/AuthVerify.js";
import {
  creerProduitTuyauterie,
  obtenirProduitsTuyauterie,
  obtenirProduitTuyauterieParId,
  supprimerProduitTuyauterie
} from "../controllers/ControleurProduitTuyauterie.js";

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

// Routes publiques pour tuyauterie et accessoires
router.get("/",    obtenirProduitsTuyauterie);
router.get("/:id", obtenirProduitTuyauterieParId);

// Routes admin pour tuyauterie
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload,
  creerProduitTuyauterie
);

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  supprimerProduitTuyauterie
);

export default router;
