// models/ProduitHydraulique.js

import mongoose from "mongoose";
const { Schema } = mongoose;

// 1. La seule catégorie pour cette collection « Équipements hydrauliques »
export const CATEGORIE_PRINCIPALE = "Équipements hydrauliques";

// 2. Sous-catégories d’exemple (à modifier ensuite)
export const SOUS_CATEGORIES = [
  "hydraulique1",
  "hydraulique2",
  "hydraulique3",
  "hydraulique4"
];

// 3. Sous-sous-catégories d’exemple pour chaque sous-catégorie
export const SOUS_SOUS_CATEGORIES = [
  "hydr1",
  "hydr2",
  "hydr3",
  "hydr4"
];

const produitHydrauliqueSchema = new Schema(
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

export default mongoose.model("ProduitHydraulique", produitHydrauliqueSchema);
