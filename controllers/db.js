import { hitungPajak, hitungKredit, hitungDiskon } from "../utils.js";

// schema
import Books from "../model/Books.js";
import BookShelf from "../model/BookShelf.js";

import mongoose from "mongoose";
import fs from "fs/promises";
import { log } from "console";

export const beliBuku = async (req, res) => {
  let detailBuku = req.body.detailBuku;
  let jangkaWaktuKredit = req.body.jangkaWaktuKredit;
  let jumlahBeli = req.body.jumlahBeli;
  let hargaTambahan = req.body.hargaTambahan;

  const pajak = 5;
  let hargaAsli = 0;
  let hargaDiskon = 0;
  let hargaPajak = 0;
  let hargaTotal = 0;

  // check data is null/not
  if (!detailBuku.judul) {
    return res.status(400).json({
      error: `Judul is null`,
    });
  }
  if (!detailBuku.penulis) {
    return res.status(400).json({
      error: `Penulis is null`,
    });
  }
  if (!detailBuku.harga) {
    return res.status(400).json({
      error: `Harga is null`,
    });
  }
  if (!detailBuku.diskon) {
    return res.status(400).json({
      error: `Diskon is null`,
    });
  }
  if (!detailBuku.publisher) {
    return res.status(400).json({
      error: `Publisher is null`,
    });
  }
  if (!detailBuku.genre) {
    return res.status(400).json({
      error: `Genre is null`,
    });
  }
  if (!detailBuku.stok) {
    return res.status(400).json({
      error: `Stok is null`,
    });
  }
  if (!jangkaWaktuKredit) {
    return res.status(400).json({
      error: `Jangka Waktu Kredit is null`,
    });
  }
  if (!jumlahBeli) {
    return res.status(400).json({
      error: `jumlah beli is null`,
    });
  }
  if (!hargaTambahan) {
    return res.status(400).json({
      error: `harga tambahan is null`,
    });
  }

  // check if amount is higher that current stock
  if (jumlahBeli > detailBuku.stok) {
    return res.status(200).json({
      error: `Stok Tidak Cukup.`,
    });
  } else {
    // insert into book collection
    try {
      const book = await Books.insertMany({
        buku: {
          judul: detailBuku.judul,
          penulis: detailBuku.penulis,
          publisher: detailBuku.publisher,
          genre: detailBuku.genre,
        },
        harga: detailBuku.harga,
        diskon: detailBuku.diskon,
        stok: detailBuku.stok,
      });
      log("Data has been added into Books Collection");
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }

    let alreadyCreated = 0;
    try {
      alreadyCreated = await BookShelf.countDocuments();
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }

    var bookID = 0;
    try {
      bookID = await Books.findOne().sort({ field: "asc", _id: -1 });
      log("ID Buku Terakhir : " + bookID._id);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }

    if (alreadyCreated > 0) {
      var bookShelfID = 0;
      try {
        bookShelfID = await BookShelf.findOne();
        log("ID BookShelf : " + bookShelfID._id);
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: 1,
          message: err,
        });
      }

      // update bookshelf without overwrite
      try {
        const bookShelf = await BookShelf.updateOne(
          { _id: bookShelfID._id },
          { $addToSet: { idBook: bookID._id, books: bookID.book } }
        );
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: 1,
          message: err,
        });
      }
    } else {
      // not yet created
      try {
        const book = {
          id: bookID._id,
          judul: detailBuku.judul,
          penulis: detailBuku.penulis,
          publisher: detailBuku.publisher,
          genre: detailBuku.genre,
        };

        const bookShelf = await BookShelf.insertMany({
          idBook: bookID._id,
          books: book,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: 1,
          message: err,
        });
      }
    }

    // calculate total price
    hargaAsli = detailBuku.harga * jumlahBeli;
    hargaDiskon = hitungDiskon(detailBuku.harga, jumlahBeli, detailBuku.diskon);
    hargaPajak = hitungPajak(hargaDiskon, pajak);
    var pembayaranKredit = await hitungKredit(
      hargaPajak,
      jangkaWaktuKredit,
      hargaTambahan
    );
    hargaTotal = hargaPajak + hargaTambahan * jangkaWaktuKredit;
    detailBuku = {
      judul: detailBuku.judul,
      penulis: detailBuku.penulis,
      publisher: detailBuku.publisher,
      genre: detailBuku.genre,
      harga: detailBuku.harga,
      persenanDiskon: detailBuku.diskon,
      stokTersisa: detailBuku.stok - jumlahBeli,
    };
  }

  // save into object
  var objData = {
    detailBuku: detailBuku,
    jumlahBeli: jumlahBeli,
    hargaTotalAsli: hargaAsli,
    hargaTotalSetelahDiskon: hargaDiskon,
    persenanPajak: pajak,
    hargaTotalSetelahaPajak: hargaPajak,
    jangkaWaktuKredit: jangkaWaktuKredit,
    hargaTambahan: hargaTambahan,
    totalHargaTambahan: hargaTambahan * jumlahBeli,
    hargaTotal: hargaTotal,
    pembayaranKredit: pembayaranKredit,
  };

  // set
  let setBooks = new Set();
  setBooks.add([detailBuku]);
  for (let i = 1; i < 10; i++) {
    setBooks.add("Buku" + i);
  }

  // map
  let mapBooks = new Map();
  mapBooks.set("book1", detailBuku.judul);
  for (let i = 2; i < 10; i++) {
    mapBooks.set("book" + i, "Buku Siswa " + 1);
  }

  // overwrite object into text.txt
  await fs.writeFile(`text.txt`, JSON.stringify(objData));

  // response success
  return res.status(200).json({
    error: 0,
    message: "Data has been added",
    object: objData,
    setBooks: Array.from(setBooks),
    mapBooks: Array.from(mapBooks.values()),
  });
};

export const tambahKoleksiBuku = async (req, res) => {
  let bookData = req.body;
  if (Array.isArray(bookData)) {
    // for arrray of book
    bookData.forEach(function (obj) {
      try {
        const book = Books.insertMany({
          buku: {
            judul: obj.book.judul,
            penulis: obj.book.penulis,
            publisher: obj.book.publisher,
            genre: obj.book.genre,
          },
          harga: obj.harga,
          diskon: obj.diskon,
          stok: obj.stok,
        });
        log("Data sudah ditambahkan ke DB mongo");
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: 1,
          message: err,
        });
      }
    });
    return res.status(200).json({
      error: 0,
      message: "Success ditambahkan",
    });
  } else {
    // single book
    bookData = req.body.book;
    const hargaData = req.body.harga;
    const diskonData = req.body.diskon;
    const stokData = req.body.stok;

    try {
      const book = await Books.insertMany({
        buku: {
          judul: bookData.judul,
          penulis: bookData.penulis,
          publisher: bookData.publisher,
          genre: bookData.genre,
        },
        harga: hargaData,
        diskon: diskonData,
        stok: stokData,
      });
      log("Data sudah ditambahkan ke DB mongo");
      return res.status(200).json({
        error: 0,
        message: "Sukses ditambahkan",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }
  }
};

export const lihatKoleksiBuku = async (req, res) => {
  try {
    const book = await Books.find({});
    if (book.length == 0) {
      res.send({
        error: 1,
        message: "No Data",
      });
    } else {
      res.send({
        error: 0,
        book: book,
      });
    }
    console.log(book);
  } catch (err) {
    console.log(err);
    res.send({
      error: 1,
      message: err,
    });
  }
};

export const tambahKoleksiBookShelf = async (req, res) => {
  let book = req.body.book;
  // check data is null/not
  if (!book.judul) {
    return res.status(400).json({
      error: `judul is null`,
    });
  }
  if (!book.penulis) {
    return res.status(400).json({
      error: `penulis is null`,
    });
  }
  if (!book.publisher) {
    return res.status(400).json({
      error: `Publisher is null`,
    });
  }
  if (!book.genre) {
    return res.status(400).json({
      error: `Genre is null`,
    });
  }

  // create book obj
  var bookID = new mongoose.Types.ObjectId();
  let bookData = {
    _id: null,
    judul: book.judul,
    penulis: book.penulis,
    publisher: book.publisher,
    genre: book.genre,
  };
  bookData._id = bookID;

  // check if bookshelf already created or not
  let alreadyCreated = 0;
  try {
    alreadyCreated = await BookShelf.countDocuments();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 1,
      message: err,
    });
  }

  if (alreadyCreated > 0) {
    var bookShelfID = 0;
    try {
      bookShelfID = await BookShelf.findOne();
      log("ID BookShelf : " + bookShelfID._id);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }

    // update bookshelf without overwrite
    try {
      const bookShelf = await BookShelf.updateOne(
        { _id: bookShelfID._id },
        { $addToSet: { idBook: bookID, books: bookData } }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }
  } else {
    // not yet created
    try {
      const bookShelf = await BookShelf.insertMany({
        idBook: bookID,
        books: bookData,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }
  }

  return res.status(200).json({
    error: 0,
    message: "Success Added",
  });
};

export const lihatKoleksiBookShelf = async (req, res) => {
  try {
    const bookShelf = await BookShelf.find({});
    if (bookShelf.length == 0) {
      res.send({
        error: 1,
        message: "No Data",
      });
    } else {
      res.send({
        error: 0,
        bookShelf: bookShelf,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({
      error: 1,
      message: err,
    });
  }
};

export const updateKoleksiBookShelf = async (req, res) => {
  const judulIdentifier = req.query.judulIdentifier;
  const judulChanged = req.query.judulChanged;
  if (!judulIdentifier || !judulChanged) {
    return res.status(400).json({
      error: `Parameters are missing`,
    });
  }
  try {
    const response = await BookShelf.updateOne(
      { "books.judul": judulIdentifier },
      { $set: { "books.$.judul": judulChanged } }
    );
  } catch (err) {
    console.log(err);
    res.send({
      error: 1,
      message: err,
    });
  }
};

export const deleteKoleksiBookShelf = async (req, res) => {
  const judul = req.query.judul;
  if (!judul) {
    return res.status(400).json({
      error: `judul are missing`,
    });
  }

  let alreadyCreated = 0;
  try {
    alreadyCreated = await BookShelf.countDocuments();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 1,
      message: err,
    });
  }

  var response = undefined;
  if (alreadyCreated > 0) {
    try {
      response = await BookShelf.findOne(
        { "books.judul": judul },
        { "books.$": 1 }
      );
      const dataBook = response.books;
      dataBook.forEach(function (record) {
        response = record._id;
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }
  } else {
    return res.status(200).json({
      error: 0,
      message: "No data can be deleted",
    });
  }

  // check if book has found/noot
  if (response == null) {
    return res.send({
      error: 1,
      message: "No data found",
    });
  } else {
    try {
      // delete ID data from array of id (idBook) using id from {response}
      const temp = await BookShelf.updateOne(
        { idBook: response },
        { $pull: { idBook: response } }
      );
      // log("delete ID : "+ temp);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: 1,
        message: err,
      });
    }
  }

  // delete book data from array of book (books)
  try {
    const temp = await BookShelf.updateOne(
      { "books.judul": judul },
      { $pull: { books: { judul: judul } } }
    );
    // log("delete Book : "+ temp);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 1,
      message: err,
    });
  }

  return res.status(200).json({
    error: 0,
    message: "Success",
  });
};

export const filterBookShelfByID = async (req, res) => {
  var id = req.query.idBook;
  if (id.length != 24) {
    res.send({
      error: 1,
      message: "Invalid ID, ID must be 24 characters long",
    });
  }

  try {
    const bookShelf = await BookShelf.find({
      idBook: new mongoose.mongo.ObjectId(id),
    });
    if (bookShelf.length == 0) {
      res.send({
        error: 1,
        message: "No Data",
      });
    } else {
      res.send({
        error: 0,
        bookShelf: bookShelf,
      });
    }
    console.log(book);
  } catch (err) {
    console.log(err);
  }
};
