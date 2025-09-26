import mongoose from "mongoose";
const { Schema } = mongoose;

// 1. La seule catégorie pour cette collection « Robinetterie et instrumentation »
export const CATEGORIE_PRINCIPALE = "Robinetterie et instrumentation";

// 2. Sous-catégories d’exemple (à modifier ensuite)
export const SOUS_CATEGORIES = [
  "robinet1",
  "robinet2",
  "robinet3",
  "robinet4"
];

// 3. Sous-sous-catégories d’exemple pour chaque sous-catégorie
export const SOUS_SOUS_CATEGORIES = [
  "tube1",
  "tube2",
  "tube3",
  "tube4"
];

const produitRobinetterieSchema = new Schema(
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
    // subSubCategory est toujours requis pour l’instant
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

export default mongoose.model("ProduitRobinetterie", produitRobinetterieSchema);
