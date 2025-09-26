import ProduitLavage, { LAVAGE_SUBCATS, LAVAGE_TYPES } from "../models/ProduitLavage.js";

// Créer un produit « lavage »
export const creerProduitLavage = async (req, res) => {
  try {
    const { name, description, category, subCategory, subSubCategory, specifications } = req.body;

    // 1. Validation sous-catégorie
    if (!LAVAGE_SUBCATS.includes(subCategory)) {
      return res.status(400).json({ message: "Sous-catégorie invalide pour lavage." });
    }

    // 2. Si subCategory ≠ "Toutes", on vérifie subSubCategory
    if (subCategory !== "Toutes") {
      if (!subSubCategory) {
        return res.status(400).json({ message: "La sous-sous-catégorie est requise." });
      }
      if (!LAVAGE_TYPES.includes(subSubCategory)) {
        return res
          .status(400)
          .json({ message: "Sous-sous-catégorie invalide pour lavage." });
      }
    }

    // 3. Gestion des fichiers uploadés par Multer
    let imageUrl = "";
    let pdfUrl = "";
    if (req.files?.image) imageUrl = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.pdf) pdfUrl = `/uploads/${req.files.pdf[0].filename}`;

    // 4. Construction de l’objet à sauvegarder
    const prodData = {
      name,
      description,
      category,
      subCategory,
      image: imageUrl,
      pdf: pdfUrl,
      specifications: JSON.parse(specifications || "{}"),
    };

    // On n’ajoute subSubCategory que si subCategory ≠ "Toutes"
    if (subCategory !== "Toutes") {
      prodData.subSubCategory = subSubCategory;
    }

    const nouveau = new ProduitLavage(prodData);
    await nouveau.save();

    res.status(201).json({ message: "Produit lavage créé avec succès", product: nouveau });
  } catch (err) {
    console.error("❌ creerProduitLavage error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

// Récupérer tous les produits « lavage »
export const getLavages = async (req, res) => {
  try {
    const list = await ProduitLavage.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    console.error("❌ getLavages error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

// Récupérer un seul produit par son ID
export const getLavageById = async (req, res) => {
  try {
    const prod = await ProduitLavage.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
    res.status(200).json(prod);
  } catch (err) {
    console.error("❌ getLavageById error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

// Supprimer un produit (admin seulement)
export const deleteLavage = async (req, res) => {
  try {
    const prod = await ProduitLavage.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
    await prod.remove();
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("❌ deleteLavage error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};
