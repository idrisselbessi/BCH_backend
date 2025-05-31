import mongoose from "mongoose";
const { Schema } = mongoose;

export const VALID_CATEGORIES = [
  "Matériels de lutte contre l’incendie",
  "Équipements pétroliers",
  "Robinetterie et instrumentation",
  "Équipements de salle de lavage",
  "Équipements hydrauliques",
  "Tuyauterie et accessoires de raccordement"
];

// Sous-catégories pour « Matériels de lutte contre l’incendie »
export const FIRE_SUBCATS = [
  "Toutes",
  "Extincteurs",
  "Lances Monitor",
  "Équipements pour sapeurs-pompiers",
  "Équipements pour installations fixes"
];

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: VALID_CATEGORIES
  },
  subCategory: {
    type: String,
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
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
