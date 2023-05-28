export const hitungPajak = (harga, pajak) => {
  return (harga *= 1 + pajak / 100); // multiplication assignment
};

export const hitungKredit = async function (
  hargaPajak,
  jangkaWaktuKredit,
  hargaTambahan
) {
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
};

export const hitungDiskon = (harga, bagian, persen) => {
  persen /= 100; // division assignment
  harga -= harga * persen; // subtraction assignment
  return harga * bagian;
};

export const isAuth = function (req, res, next) {
  const auth = req.headers.authorization;
  if (auth === "your_password") {
    next();
  } else {
    res.status(401);
    res.send("Access forbidden");
  }
};
