import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  tel: { type: String, required: false, trim: true },
  nom: { type: String, required: false, trim: true },
  prenom: { type: String, required: false, trim: true },
  societe: { type: String, required: true, trim: true },
  role: { type: String, enum: ["admin", "user", "moderator"], default: "user" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
