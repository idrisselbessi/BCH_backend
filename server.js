import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import userRoutes from "./routes/UserRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";

const app = express();
const port = process.env.PORT || 3337;
const dbUrl = "mongodb://127.0.0.1:27017";
const dbName = "bouchaddakh_DB";

mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose
  .connect(`${dbUrl}/${dbName}`)
  .then(() => console.log(`Connected to ${dbName}`))
  .catch(err => console.error(err));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// dossiers statiques
app.use("/img",     express.static("public/images"));
app.use("/uploads", express.static("public/uploads"));

// routes
app.use("/api/users",    userRoutes);
app.use("/api/products", productRoutes);

// gestion des erreurs
app.use(notFoundError);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
