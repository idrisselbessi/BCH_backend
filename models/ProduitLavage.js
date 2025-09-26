import mongoose from "mongoose";
const { Schema } = mongoose;

// 1. Sous-catégories pour « Équipements de salle de lavage »
export const LAVAGE_SUBCATS = [
  "Toutes",
  "lavage1",
  "lavage2",
  "lavage3",
  "lavage4",
];

// 2. Types de sous-sous-catégorie (quand subCategory ≠ "Toutes")
export const LAVAGE_TYPES = [
  "Toutes",
  "lav1",
  "lav2",
  "lav3",
  "lav4",
];

const produitLavageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: "Équipements de salle de lavage",
    },
    subCategory: {
      type: String,
      required: true,
      enum: LAVAGE_SUBCATS,
    },
    // subSubCategory n’est requis que si subCategory ≠ "Toutes"
    subSubCategory: {
      type: String,
      enum: LAVAGE_TYPES,
      required: function () {
        return this.subCategory !== "Toutes";
      },
    },
    image: {
      type: String,
      trim: true,
    },
    pdf: {
      type: String,
      trim: true,
    },
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProduitLavage", produitLavageSchema);
