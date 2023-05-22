function beliBarang(data, cicilan, jumlah) {
  result = [];
  data.forEach((element) => {
    let ketentuan = cicilan;
    for (let i = 0; i < ketentuan; i++) {
      bunga = (jumlah / 100) * (element.harga / cicilan);
      total =
        element.harga / cicilan + (jumlah / 100) * (element.harga / cicilan);
      result.push({
        Barang: element.title,
        Cicilan: i,
        Bunga: bunga,
        Total: total,
      });
    }
  });
  return result;
}

module.exports = beliBarang;
