// controllers/ControleurProduitPetrolier.js

import ProduitPetrolier, {
    CATEGORIE_PRINCIPALE,
    SOUS_CATEGORIES,
    SOUS_SOUS_CATEGORIES
  } from "../models/ProduitPetrolier.js";
  
  // Créer un produit « Équipements pétroliers »
  export const creerProduitPetrolier = async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        subCategory,
        subSubCategory,
        specifications
      } = req.body;
  
      // 1. Validation de la catégorie principale
      if (category !== CATEGORIE_PRINCIPALE) {
        return res
          .status(400)
          .json({ message: "Catégorie invalide pour Équipements pétroliers." });
      }
  
      // 2. Validation de la sous-catégorie
      if (!SOUS_CATEGORIES.includes(subCategory)) {
        return res
          .status(400)
          .json({ message: "Sous-catégorie invalide pour Équipements pétroliers." });
      }
  
      // 3. Validation de la sous-sous-catégorie (toujours requise)
      if (!subSubCategory) {
        return res
          .status(400)
          .json({ message: "La sous-sous-catégorie est requise." });
      }
      if (!SOUS_SOUS_CATEGORIES.includes(subSubCategory)) {
        return res
          .status(400)
          .json({ message: "Sous-sous-catégorie invalide pour Équipements pétroliers." });
      }
  
      // 4. Gestion des fichiers uploadés par Multer
      let imageUrl = "";
      let pdfUrl = "";
      if (req.files?.image) imageUrl = `/uploads/${req.files.image[0].filename}`;
      if (req.files?.pdf)   pdfUrl   = `/uploads/${req.files.pdf[0].filename}`;
  
      // 5. Création de l’objet produit
      const prodData = {
        name,
        description,
        category,
        subCategory,
        subSubCategory,
        image: imageUrl,
        pdf: pdfUrl,
        specifications: JSON.parse(specifications || "{}")
      };
  
      const prod = new ProduitPetrolier(prodData);
      await prod.save();
  
      res.status(201).json({ message: "Produit pétrolier créé.", product: prod });
    } catch (err) {
      console.error("❌ creerProduitPetrolier error:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message, errors: err.errors });
      }
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Récupérer tous les produits pétroliers
  export const obtenirProduitsPetroliers = async (req, res) => {
    try {
      const list = await ProduitPetrolier.find().sort({ createdAt: -1 });
      res.status(200).json(list);
    } catch (err) {
      console.error("❌ obtenirProduitsPetroliers error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Récupérer un produit pétrolier par ID
  export const obtenirProduitPetrolierParId = async (req, res) => {
    try {
      const prod = await ProduitPetrolier.findById(req.params.id);
      if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
      res.status(200).json(prod);
    } catch (err) {
      console.error("❌ obtenirProduitPetrolierParId error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Supprimer un produit pétrolier (admin seulement)
  export const supprimerProduitPetrolier = async (req, res) => {
    try {
      const prod = await ProduitPetrolier.findById(req.params.id);
      if (!prod) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      await ProduitPetrolier.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Produit pétrolier supprimé avec succès" });
    } catch (err) {
      console.error("❌ supprimerProduitPetrolier error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  