const { setTimeout } = require("timers/promises");
let purchasing = require("./purchasing");
const { resolve } = require("path");

var jumlahBuku = 1000;
var ketertarikan = 1;

function beliBuku(stokBuku, jumlhaBukuYangDibeli, cicilan, harga) {
  let jangkaWaktuKredit = function () {
    success = false;
    return new Promise((resolve) => {
      this.setTimeout(() => {
        success = true;
        if (success) {
          resolve(
            purchasing(
              [
                {
                  judul: "yuhuu books",
                  harga: harga * jumlhaBukuYangDibeli,
                },
              ],
              cicilan,
              ketertarikan
            )
          );
        }
      }, 2000);
    });
  };
  let jumlah = 0;
  let habis = false;

  for (let i = 0; i < jumlhaBukuYangDibeli; i++) {
    if (stokBuku <= jumlah) {
      habis = true;
      break;
    } else {
      jumlah += 1;
    }
  }
  if (!habis) {
    console.log(`Buku dibeli : ${jumlhaBukuYangDibeli}`);
    console.log(`Sisa buku : ${stokBuku - jumlhaBukuYangDibeli}`);
    jumlahBuku -= jumlhaBukuYangDibeli;
    return jangkaWaktuKredit();
  } else {
    console.log("Buku Habis");
    jumlahBuku = 0;
    return "Gagal Beli";
  }
}

async function run() {
  const result = await beliBuku(jumlahBuku, 3, 4, 100000);
  console.log(result);
}

run();
