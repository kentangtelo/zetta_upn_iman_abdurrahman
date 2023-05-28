import mongoose from "mongoose";

var bookDetailsSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true,
    unique: false,
  },
  penulis: {
    type: String,
    required: true,
    unique: false,
  },
  publisher: {
    type: String,
    required: true,
    unique: false,
  },
  genre: {
    type: Array,
    required: true,
    unique: false,
  },
});

var booksSchema = new mongoose.Schema({
  buku: {
    type: bookDetailsSchema,
    required: true,
  },
  harga: {
    type: Number,
    required: true,
    unique: false,
  },
  diskon: {
    type: Number,
    required: true,
    unique: false,
  },
  stok: {
    type: Number,
    required: true,
    unique: false,
  },
});

//Export the model
export default mongoose.model("Books", booksSchema);
