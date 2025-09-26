// src/models/Incendie.js

import mongoose from "mongoose";
const { Schema } = mongoose;

// 1. Catégories principales (seule “Incendie” ici)
export const FIRE_SUBCATS = [
  "Toutes",
  "Extincteurs",
  "Lances Monitor",
  "Équipements pour sapeurs-pompiers",
  "Équipements pour installations fixes"
];

// 2. Type d’Extincteur
export const EXTINGUISHER_SUBCATS = [
  "Toutes",
  "CO₂",
  "Poudre",
  "Eau pulvérisée",
  "Eau + additif (mousse)",
  "Accessoires"
];

// 3. Sous-catégories “Équipements pour sapeurs-pompiers”
export const SAPEURS_SUBCATS = [
  "Toutes",
  "Lance d'incendie",
  "Équipement mousse",
  "Pièces de jonction",
  "Appareils de mesure",
  "Flexible d'incendie et accessoires",
  "Clé de manœuvre",
  "Raccord d'incendie"
];

// 4. Sous-catégories “Équipements pour installations fixes”
export const INSTALLATIONS_SUBCATS = [
  "Toutes",
  "Robinet d'incendie armé (RIA)",
  "Poste d'incendie additif (PIA)",
  "Poteaux et bouches d'incendie",
  "Robinet pour colonnes sèches"
];

const incendieSchema = new Schema(
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
    // Note: “category” ici est implicite “Matériels de lutte contre l’incendie”
    subCategory: {
      type: String,
      required: true,
      enum: FIRE_SUBCATS,
    },
    // “subSubCategory” uniquement si subCategory est l’un des trois cas suivants :
    subSubCategory: {
      type: String,
      enum: [
        ...EXTINGUISHER_SUBCATS,
        ...SAPEURS_SUBCATS,
        ...INSTALLATIONS_SUBCATS,
      ],
      required: function () {
        return (
          this.subCategory === "Extincteurs" ||
          this.subCategory === "Équipements pour sapeurs-pompiers" ||
          this.subCategory === "Équipements pour installations fixes"
        );
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

export default mongoose.model("Incendie", incendieSchema);
