// controllers/ControleurProduitHydraulique.js

import ProduitHydraulique, {
    CATEGORIE_PRINCIPALE,
    SOUS_CATEGORIES,
    SOUS_SOUS_CATEGORIES
  } from "../models/ProduitHydraulique.js";
  
  // Créer un produit « Équipements hydrauliques »
  export const creerProduitHydraulique = async (req, res) => {
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
          .json({ message: "Catégorie invalide pour Équipements hydrauliques." });
      }
  
      // 2. Validation de la sous-catégorie
      if (!SOUS_CATEGORIES.includes(subCategory)) {
        return res
          .status(400)
          .json({ message: "Sous-catégorie invalide pour Équipements hydrauliques." });
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
          .json({ message: "Sous-sous-catégorie invalide pour Équipements hydrauliques." });
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
  
      const prod = new ProduitHydraulique(prodData);
      await prod.save();
  
      res.status(201).json({ message: "Produit hydraulique créé.", product: prod });
    } catch (err) {
      console.error("❌ creerProduitHydraulique error:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message, errors: err.errors });
      }
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Récupérer tous les produits hydrauliques
  export const obtenirProduitsHydrauliques = async (req, res) => {
    try {
      const list = await ProduitHydraulique.find().sort({ createdAt: -1 });
      res.status(200).json(list);
    } catch (err) {
      console.error("❌ obtenirProduitsHydrauliques error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Récupérer un produit hydraulique par ID
  export const obtenirProduitHydrauliqueParId = async (req, res) => {
    try {
      const prod = await ProduitHydraulique.findById(req.params.id);
      if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
      res.status(200).json(prod);
    } catch (err) {
      console.error("❌ obtenirProduitHydrauliqueParId error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Supprimer un produit hydraulique (admin seulement)
  export const supprimerProduitHydraulique = async (req, res) => {
    try {
      const prod = await ProduitHydraulique.findById(req.params.id);
      if (!prod) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      await ProduitHydraulique.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Produit hydraulique supprimé avec succès" });
    } catch (err) {
      console.error("❌ supprimerProduitHydraulique error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  