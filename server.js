// server.js  (ou index.js)

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import userRoutes from "./routes/UserRoutes.js";

// ** On supprime ou commente l’ancien import “productRoutes” **
// import productRoutes from "./routes/ProductRoutes.js";

import incendieRoutes from "./routes/incendie.js";
import rocuRoutes from "./routes/robinetterie.js";
import washProductRoutes from "./routes/lavage.js";
import hydrauliqueRoutes from "./routes/hydraulique.js";
import tuyauterieRoutes from "./routes/tuyauterie.js";
import petrolierRoutes from "./routes/petrolier.js";

const app = express();
const port = process.env.PORT || 3337;
const dbUrl = "mongodb://127.0.0.1:27017";
const dbName = "bouchaddakh_DB";

mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose
  .connect(`${dbUrl}/${dbName}`)
  .then(() => console.log(`Connected to ${dbName}`))
  .catch((err) => console.error(err));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossiers statiques
app.use("/img", express.static("public/images"));
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/users", userRoutes);

// → On remplace “/api/products” par “/api/incendie”
app.use("/api/incendie", incendieRoutes);

app.use("/api/robinetterie", rocuRoutes);
app.use("/api/lavage", washProductRoutes);
app.use("/api/hydraulique", hydrauliqueRoutes);
app.use("/api/tuyauterie", tuyauterieRoutes);
app.use("/api/petrolier", petrolierRoutes);

// Gestion des erreurs
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
