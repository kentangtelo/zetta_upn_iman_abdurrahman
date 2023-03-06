function purchaseBook(
  bookTitle,
  author,
  price,
  discountPercentage,
  taxPercentage,
  isAvailable
) {
  const DISCOUNT_RATE = 0.01;
  const TAX_RATE = 0.01;

  // Calculate discount amount
  let discountAmount = price * (discountPercentage * DISCOUNT_RATE);

  // Calculate price after discount
  let priceAfterDiscount = price - discountAmount;

  // Calculate tax amount
  let taxAmount = priceAfterDiscount * (taxPercentage * TAX_RATE);

  // Calculate price after tax
  let priceAfterTax = priceAfterDiscount + taxAmount;

  console.log("Book Title:", bookTitle);
  console.log("Author:", author);
  console.log("Price:", price);
  console.log("Discount Percentage:", discountPercentage);
  console.log("Tax Percentage:", taxPercentage);
  console.log("Discount Amount:", discountAmount);
  console.log("Price After Discount:", priceAfterDiscount);
  console.log("Tax Amount:", taxAmount);
  console.log("Price After Tax:", priceAfterTax);
  console.log("Is Available:", isAvailable);
}

// Example usage
purchaseBook("The Catcher in the Rye", "J.D. Salinger", 10, 20, 8, true);
