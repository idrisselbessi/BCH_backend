import express from "express";
import multer from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { authMiddleware, isAdmin } from "../middlewares/AuthVerify.js";
import {
  createProduct,
  getProducts,
  getProductById
} from "../controllers/ProductController.js";

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

// Public
router.get("/",    getProducts);
router.get("/:id", getProductById);

// Admin only + Multer pour parser multipart/form-data
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload,        // <— Multer : req.body + req.files
  createProduct  // <— Controller
);

export default router;
