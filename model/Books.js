var mongoose = require(`mongoose`);

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

var booksSchema = new mongoose.Schema({
  detailBuku: {
    type: bookDetailsSchema,
    required: true,
  },
  jumlahBeli: {
    type: Number,
    required: true,
    unique: false,
  },
  jangkaWaktuKredit: {
    type: Number,
    required: true,
    unique: false,
  },
  hargaTambahan: {
    type: Number,
    required: true,
    unique: false,
  },
});

//Export the model
module.exports = mongoose.model("Books", booksSchema);
