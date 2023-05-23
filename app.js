const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fs = require("fs/promises");
const { log } = require("console");
const mongoose = require(`mongoose`);
const Books = require(`./model/Books`);
const BookShelf = require("./model/BookShelf");

const PORT = 3000;
const dbName = `book`;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://0.0.0.0:27017/" + dbName);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Database error!"));
db.once("open", () => {
  console.log("Database connected");
});
//lis

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/bookPurchasing", isAuth, async (req, res) => {
  let detailBuku = req.body.detailBuku;
  let jangkaWaktuKredit = req.body.jangkaWaktuKredit;
  let jumlahBeli = req.body.jumlahBeli;
  let hargaTambahan = req.body.hargaTambahan;

  const pajak = 5;
  let hargaOriginal = 0;
  let hargaDiskon = 0;
  let hargaPajak = 0;
  let hargaTotal = 0;

  // check data is null/not
  if (!detailBuku.judul) {
    return res.status(400).json({
      error: `Judul null`,
    });
  }
  if (!detailBuku.penulis) {
    return res.status(400).json({
      error: `Penulis null`,
    });
  }
  if (!detailBuku.harga) {
    return res.status(400).json({
      error: `Harga null`,
    });
  }
  if (!detailBuku.diskon) {
    return res.status(400).json({
      error: `Diskon null`,
    });
  }
  if (!detailBuku.publisher) {
    return res.status(400).json({
      error: `Publisher null`,
    });
  }
  if (!detailBuku.stok) {
    return res.status(400).json({
      error: `Stok null`,
    });
  }
  if (!jangkaWaktuKredit) {
    return res.status(400).json({
      error: `Jangka waktu kredit null`,
    });
  }
  if (!jumlahBeli) {
    return res.status(400).json({
      error: `Jumlah beli null`,
    });
  }
  if (!hargaTambahan) {
    return res.status(400).json({
      error: `Harga tambahan null`,
    });
  }

  // check if amount is higher that current stock
  if (jumlahBeli > detailBuku.stok) {
    return res.status(200).json({
      error: `Stok Tidak Cukup.`,
    });
  } else {
    // insert into mongo
    try {
      const book = await Books.insertMany({
        detailBuku: {
          judul: detailBuku.judul,
          penulis: detailBuku.penulis,
          publisher: detailBuku.publisher,
          harga: detailBuku.harga,
          diskon: detailBuku.diskon,
          stok: detailBuku.stok,
        },
        jumlahBeli: jumlahBeli,
        jangkaWaktuKredit: jangkaWaktuKredit,
        hargaTambahan: hargaTambahan,
      });
      log("Data has been adden to mongo");
    } catch (err) {
      console.log(err);
    }

    var bookID = 0;
    try {
      bookID = await Books.findOne().sort({ field: "asc", _id: -1 });
      log("Inserted ID : " + bookID._id);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 1,
        message: error,
      });
    }

    try {
      const bookShelf = await BookShelf.insertMany({ idBook: bookID._id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 1,
        message: error,
      });
    }

    hargaOriginal = detailBuku.harga * jumlahBeli;
    hargaDiskon = hitungDiskon(detailBuku.harga, jumlahBeli, detailBuku.diskon); // addition assignment
    hargaPajak = hitungPajak(hargaDiskon, pajak);
    pembayaranKredit = await hitungKredit(
      hargaPajak,
      jangkaWaktuKredit,
      hargaTambahan
    );
    hargaTotal = hargaPajak + hargaTambahan * jangkaWaktuKredit;
    detailBuku = {
      judul: detailBuku.judul,
      penulis: detailBuku.penulis,
      publisher: detailBuku.publisher,
      harga: detailBuku.harga,
      persenDiskon: detailBuku.diskon,
      stokTersisa: detailBuku.stok - jumlahBeli,
    };
  }

  // save into object
  objData = {
    detailBuku: detailBuku,
    jumlahBeli: jumlahBeli,
    hargaTotalOriginal: hargaOriginal,
    hargaTotalSetelahDiskon: hargaDiskon,
    persenPajak: pajak,
    hargaTotalSetelahPajak: hargaPajak,
    jangkaWaktuKredit: jangkaWaktuKredit,
    hargaTambahan: hargaTambahan,
    hargaTotalSetelahDitambah: hargaTambahan * jumlahBeli,
    hargaTotal: hargaTotal,
    pembayaranKredit: pembayaranKredit,
  };

  // set
  let setBooks = new Set();
  setBooks.add([detailBuku]);
  for (let i = 1; i < 10; i++) {
    setBooks.add("Buku" + i);
  }
  log(setBooks);

  // map
  let mapBooks = new Map();
  mapBooks.set("book1", detailBuku.judul);
  log("\nmap get value");
  for (let i = 2; i < 10; i++) {
    mapBooks.set("book" + i, "Buku Siswa " + 1);
    log(mapBooks.get("book" + i));
  }

  // write object into file text.txt
  await fs.writeFile(`zetta.json`, JSON.stringify(objData));

  return res.status(200).json({
    object: objData,
    setBooks: Array.from(setBooks),
    mapBooks: Array.from(mapBooks.values()),
  });
});

app.get("/bookPurchasing/bookShelf", isAuth, async (req, res) => {
  var id = req.query.idBook;
  try {
    const bookShelf = await BookShelf.find({
      id: new mongoose.mongo.ObjectId(id),
    });
    if (bookShelf.length == 0) {
      res.send({
        error: 0,
        message: "No Data",
      });
    } else {
      res.send({
        error: 0,
        bookShelf: bookShelf,
      });
      console.log(bookShelf);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/readFileWithAwait", isAuth, async (req, res) => {
  try {
    let data = await fs.readFile("zetta.json", { encoding: "utf8" });
    data = JSON.parse(data);
    console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/readDataFromMongoDB", isAuth, async (req, res) => {
  const fs = require("fs");
  try {
    const book = await Books.find({});
    res.send(book);
    console.log(book);
  } catch (err) {
    console.log(err);
  }
});

app.get("/readFileWithoutAwait", isAuth, (req, res) => {
  const fs = require("fs");
  try {
    let data = fs.readFileSync("zetta.json", { encoding: "utf8" });
    data = JSON.parse(data);
    console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => console.log("Api Server is running on port" + PORT));

function isAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth === "your_password") {
    next();
  } else {
    res.status(401);
    res.send("Access forbidden");
  }
}

function hitungDiskon(harga, bagian, persen) {
  persen /= 100; // division assignment
  harga -= harga * persen; // subtraction assignment
  return harga * bagian;
}

function hitungPajak(harga, pajak) {
  return (harga *= 1 + pajak / 100); // multiplication assignment
}

async function hitungKredit(hargaPajak, jangkaWaktuKredit, hargaTambahan) {
  let arrMonth = [];
  let arrCredit = [];
  let arrAdditional = [];
  let arrCreditPlusAdditional = [];
  for (var i = 0; i < jangkaWaktuKredit; i++) {
    arrMonth.push(i + 1);
    arrCredit.push(hargaPajak / jangkaWaktuKredit);
    arrAdditional.push(hargaTambahan);
    arrCreditPlusAdditional.push(arrCredit[i] + hargaTambahan);
  }

  let objCredit = [];
  let remainingBalance = hargaPajak;
  for (var i = 0; i < jangkaWaktuKredit; i++) {
    remainingBalance -= arrCredit[i];

    await objCredit.push({
      month: arrMonth[i],
      credit: arrCredit[i],
      additional: arrAdditional[i],
      totalCreditMustPay: arrCreditPlusAdditional[i],
      remainingBalance: remainingBalance,
    });
  }

  const sumCredit = arrCredit.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );
  console.log(`Total\t\t: ${sumCredit}`);

  return objCredit;
}
