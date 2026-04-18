export const getCurrencySymbol = (currencyStr) => {
  if (!currencyStr) return "$";
  switch (currencyStr.toUpperCase()) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    case "JPY": return "¥";
    default: return `${currencyStr} `;
  }
};
