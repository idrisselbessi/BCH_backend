// models/ProduitPetrolier.js

import mongoose from "mongoose";
const { Schema } = mongoose;

// 1. Catégorie principale pour cette collection « Équipements pétroliers »
export const CATEGORIE_PRINCIPALE = "Équipements pétroliers";

// 2. Sous-catégories d’exemple (à modifier selon besoin)
export const SOUS_CATEGORIES = [
  "petrolier1",
  "petrolier2",
  "petrolier3",
  "petrolier4"
];

// 3. Sous-sous-catégories d’exemple pour chaque sous-catégorie
export const SOUS_SOUS_CATEGORIES = [
  "petro1",
  "petro2",
  "petro3",
  "petro4"
];

const produitPetrolierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    // On fixe la catégorie principale
    category: {
      type: String,
      required: true,
      enum: [CATEGORIE_PRINCIPALE]
    },
    subCategory: {
      type: String,
      required: true,
      enum: SOUS_CATEGORIES
    },
    // subSubCategory est toujours requis
    subSubCategory: {
      type: String,
      enum: SOUS_SOUS_CATEGORIES,
      required: true
    },
    image: {
      type: String,
      trim: true
    },
    pdf: {
      type: String,
      trim: true
    },
    specifications: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model("ProduitPetrolier", produitPetrolierSchema);
