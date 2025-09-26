// controllers/ControleurProduitTuyauterie.js

import ProduitTuyauterie, {
    CATEGORIE_PRINCIPALE,
    SOUS_CATEGORIES,
    SOUS_SOUS_CATEGORIES
  } from "../models/ProduitTuyauterie.js";
  
  // Créer un produit « Tuyauterie et accessoires de raccordement »
  export const creerProduitTuyauterie = async (req, res) => {
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
          .json({ message: "Catégorie invalide pour Tuyauterie et accessoires de raccordement." });
      }
  
      // 2. Validation de la sous-catégorie
      if (!SOUS_CATEGORIES.includes(subCategory)) {
        return res
          .status(400)
          .json({ message: "Sous-catégorie invalide pour Tuyauterie et accessoires de raccordement." });
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
          .json({ message: "Sous-sous-catégorie invalide pour Tuyauterie et accessoires de raccordement." });
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
  
      const prod = new ProduitTuyauterie(prodData);
      await prod.save();
  
      res.status(201).json({ message: "Produit tuyauterie créé.", product: prod });
    } catch (err) {
      console.error("❌ creerProduitTuyauterie error:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message, errors: err.errors });
      }
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Récupérer tous les produits tuyauterie
  export const obtenirProduitsTuyauterie = async (req, res) => {
    try {
      const list = await ProduitTuyauterie.find().sort({ createdAt: -1 });
      res.status(200).json(list);
    } catch (err) {
      console.error("❌ obtenirProduitsTuyauterie error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Récupérer un produit tuyauterie par ID
  export const obtenirProduitTuyauterieParId = async (req, res) => {
    try {
      const prod = await ProduitTuyauterie.findById(req.params.id);
      if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
      res.status(200).json(prod);
    } catch (err) {
      console.error("❌ obtenirProduitTuyauterieParId error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  
  // Supprimer un produit tuyauterie (admin seulement)
  export const supprimerProduitTuyauterie = async (req, res) => {
    try {
      const prod = await ProduitTuyauterie.findById(req.params.id);
      if (!prod) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      await ProduitTuyauterie.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Produit tuyauterie supprimé avec succès" });
    } catch (err) {
      console.error("❌ supprimerProduitTuyauterie error:", err);
      res.status(500).json({ message: "Erreur serveur", error: err.toString() });
    }
  };
  