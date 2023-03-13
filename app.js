const BOOK_PRICE = 50;

const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  const bookTitle = event.target.elements.bookTitle.value;
  const bookAuthor = event.target.elements.bookAuthor.value;
  const bookPrice = parseFloat(event.target.elements.bookPrice.value);
  const discountPercentage = parseFloat(
    event.target.elements.discountPercentage.value
  );
  const taxPercentage = parseFloat(event.target.elements.taxPercentage.value);
  const stockAmount = parseInt(event.target.elements.stockAmount.value);
  const purchasedAmount = parseInt(event.target.elements.purchasedAmount.value);
  const creditTerm = parseInt(event.target.elements.creditTerm.value);

  const isOutOfStock = purchasedAmount > stockAmount;
  const totalAmount = isOutOfStock ? 0 : stockAmount - purchasedAmount;

  const discountAmount = bookPrice * (discountPercentage / 100);
  const priceAfterDiscount = bookPrice - discountAmount;

  const taxAmount = priceAfterDiscount * (taxPercentage / 100);
  const priceAfterTax = priceAfterDiscount + taxAmount;

  const totalPrice = purchasedAmount * priceAfterTax;
  const monthlyPrice = totalPrice / creditTerm;

  const creditDueArray = Array.from({ length: creditTerm }, (value, index) => ({
    month: index + 1,
    amount: monthlyPrice,
  }));

  const resultElement = document.getElementById("result");
  resultElement.innerHTML = `
          <p><strong>Book Title:</strong> ${bookTitle}</p>
                <p><strong>Book Author:</strong> ${bookAuthor}</p>
      <p><strong>Book Price:</strong> ${bookPrice.toFixed(2)}</p>
      <p><strong>Discount Percentage:</strong> ${discountPercentage.toFixed(
        2
      )}%</p>
      <p><strong>Tax Percentage:</strong> ${taxPercentage.toFixed(2)}%</p>
      <p><strong>Stock Amount:</strong> ${stockAmount}</p>
      <p><strong>Purchased Amount:</strong> ${purchasedAmount}</p>
      <p><strong>Amount of Discount:</strong> ${discountAmount.toFixed(2)}</p>
      <p><strong>Price After Discount:</strong> ${priceAfterDiscount.toFixed(
        2
      )}</p>
      <p><strong>Amount of Tax:</strong> ${taxAmount.toFixed(2)}</p>
      <p><strong>Price After Tax:</strong> ${priceAfterTax.toFixed(2)}</p>
      <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
      <p><strong>Monthly Price (for ${creditTerm} months):</strong> ${monthlyPrice.toFixed(
    2
  )}</p>
      <p><strong>Credit Due:</strong></p>
      <ul>
        ${creditDueArray
          .map(
            (credit) =>
              `<li>Month ${credit.month}: ${credit.amount.toFixed(2)}</li>`
          )
          .join("")}
      </ul>
    `;

  const message = isOutOfStock
    ? "Out of stock!"
    : `Remaining stock: ${totalAmount}`;
  resultElement.innerHTML += `<p><strong>Stock Status:</strong> ${message}</p>`;
}
