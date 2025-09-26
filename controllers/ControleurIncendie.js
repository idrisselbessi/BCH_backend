// src/controllers/ControleurIncendie.js

import IncendieModel, {
  FIRE_SUBCATS,
  EXTINGUISHER_SUBCATS,
  SAPEURS_SUBCATS,
  INSTALLATIONS_SUBCATS,
} from "../models/Incendie.js";

// → Créer un “Incendie”
export const creerIncendie = async (req, res) => {
  try {
    const {
      name,
      description,
      subCategory,
      subSubCategory,
      specifications,
    } = req.body;

    // 1. Validation “sous-catégorie”
    if (!FIRE_SUBCATS.includes(subCategory)) {
      return res
        .status(400)
        .json({ message: "Sous-catégorie invalide pour Incendie." });
    }

    // 2. Si “Extincteurs”, vérifier subSubCategory
    if (subCategory === "Extincteurs") {
      if (!subSubCategory) {
        return res
          .status(400)
          .json({ message: "Le type d’Extincteur est requis." });
      }
      if (!EXTINGUISHER_SUBCATS.includes(subSubCategory)) {
        return res
          .status(400)
          .json({ message: "Type d’Extincteur invalide." });
      }
    }

    // 3. Si “Équipements pour sapeurs-pompiers”, vérifier subSubCategory
    if (subCategory === "Équipements pour sapeurs-pompiers") {
      if (!subSubCategory) {
        return res
          .status(400)
          .json({ message: "Sous-catégorie requis pour Sapeurs-Pompiers." });
      }
      if (!SAPEURS_SUBCATS.includes(subSubCategory)) {
        return res
          .status(400)
          .json({ message: "Sous-catégorie invalide pour Sapeurs-Pompiers." });
      }
    }

    // 4. Si “Équipements pour installations fixes”, vérifier subSubCategory
    if (subCategory === "Équipements pour installations fixes") {
      if (!subSubCategory) {
        return res
          .status(400)
          .json({ message: "Sous-catégorie requis pour Installations fixes." });
      }
      if (!INSTALLATIONS_SUBCATS.includes(subSubCategory)) {
        return res
          .status(400)
          .json({ message: "Sous-catégorie invalide pour Installations fixes." });
      }
    }

    // 5. Aucune “subSubCategory” pour “Lances Monitor” ni “Toutes”
    if (
      (subCategory === "Lances Monitor" || subCategory === "Toutes") &&
      subSubCategory
    ) {
      return res.status(400).json({
        message: `La sous-sous-catégorie n’est pas applicable pour "${subCategory}".`,
      });
    }

    // 6. Fichiers Multer
    let imageUrl = "";
    let pdfUrl = "";
    if (req.files?.image) imageUrl = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.pdf) pdfUrl = `/uploads/${req.files.pdf[0].filename}`;

    // 7. Construire l’objet à enregistrer
    const newIncendie = new IncendieModel({
      name,
      description,
      subCategory,
      image: imageUrl,
      pdf: pdfUrl,
      specifications: JSON.parse(specifications || "{}"),
      ...( ["Extincteurs", "Équipements pour sapeurs-pompiers", "Équipements pour installations fixes"].includes(subCategory) && { subSubCategory } )
    });

    await newIncendie.save();
    res.status(201).json({ message: "Produit Incendie créé avec succès", product: newIncendie });
  } catch (err) {
    console.error("❌ creerIncendie error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

// → Récupérer tous les “Incendie”
export const getIncendies = async (req, res) => {
  try {
    const list = await IncendieModel.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    console.error("❌ getIncendies error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

// → Récupérer un seul “Incendie” par ID
export const getIncendieById = async (req, res) => {
  try {
    const prod = await IncendieModel.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
    res.status(200).json(prod);
  } catch (err) {
    console.error("❌ getIncendieById error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

// → Supprimer un “Incendie” (admin)
export const deleteIncendie = async (req, res) => {
  try {
    const prod = await IncendieModel.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
    await prod.remove();
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("❌ deleteIncendie error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};
