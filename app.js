import router from "./routes/route.js";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const PORT = 3000;
const app = express();

const dbName = `book`;
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://0.0.0.0:27017/" + dbName)
  .then(() => console.log("Connected to Mongoose..."))
  .catch((err) => console.error("Could not connect to mongodb, reason " + err));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// use router
app.use(router);

app.get("/", function (req, res) {
  res.json({ message: "Selamat datang ke API pembelian buku" });
});

app.listen(PORT, () => console.log("Api Server is running on port " + PORT));
