import Product, { FIRE_SUBCATS } from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    // ⬇️ Chiffres texte
    const {
      name,
      description,
      category,
      subCategory,
      specifications
    } = req.body;

    // Validation sous-catégorie “Incendie”
    if (
      category === "Matériels de lutte contre l’incendie" &&
      !FIRE_SUBCATS.includes(subCategory)
    ) {
      return res
        .status(400)
        .json({ message: "Sous-catégorie invalide pour la catégorie Incendie." });
    }

    // ⬇️ Fichiers uploadés par Multer
    let imageUrl = "";
    let pdfUrl   = "";
    if (req.files.image) imageUrl = `/uploads/${req.files.image[0].filename}`;
    if (req.files.pdf)   pdfUrl   = `/uploads/${req.files.pdf[0].filename}`;

    // ⬇️ Création du produit
    const prod = new Product({
      name,
      description,
      category,
      subCategory,
      image: imageUrl,
      pdf:   pdfUrl,
      specifications: JSON.parse(specifications || "{}")
    });

    await prod.save();
    res.status(201).json({ message: "Produit créé avec succès", product: prod });
  } catch (err) {
    console.error("❌ createProduct error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

export const getProducts = async (req, res) => {
  try {
    const list = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    console.error("❌ getProducts error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};

export const getProductById = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Produit non trouvé" });
    res.status(200).json(prod);
  } catch (err) {
    console.error("❌ getProductById error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.toString() });
  }
};
