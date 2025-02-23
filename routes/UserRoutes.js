import express from "express";
import { signup, signin, signout, getUsers, updateUserRole } from "../controllers/UserController.js"; // ✅ Ajout de `updateUserRole`

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/", getUsers);
router.put("/:id", updateUserRole); // ✅ Route pour modifier le rôle d'un utilisateur

export default router;
