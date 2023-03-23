module.exports = {
  bookPurchase: async (req, res, next) => {
    try {
      const {
        bookTitle,
        bookAuthor,
        bookPrice,
        discountPercentage,
        stockAmount,
        purchasedAmount,
        creditTerm,
      } = req.body;
      const isOutOfStock = purchasedAmount > stockAmount;
      const totalAmount = isOutOfStock ? 0 : stockAmount - purchasedAmount;
      const discountAmount = bookPrice * (discountPercentage / 100);
      const priceAfterDiscount = bookPrice - discountAmount;
      const taxAmount = priceAfterDiscount * (taxPercentage / 100);
      const priceAfterTax = priceAfterDiscount + taxAmount;
      const totalPrice = purchasedAmount * priceAfterTax;

      res.status(201).json({
        status: "success",
        message: "Successfully order book",
        data: {
          bookTitle,
          bookAuthor,
          bookPrice,
          discountPercentage,
          stockAmount,
          purchasedAmount,
          creditTerm,
          totalAmount,
          discountAmount,
          priceAfterDiscount,
          taxAmount,
          priceAfterTax,
          totalPrice,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
