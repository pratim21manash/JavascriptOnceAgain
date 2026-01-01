// 1. Cart Aggregation (E-commerce)
    // Given an array of cart items where each item has a name, price, and quantity, write a program to:
    // Calculate the total cart value
    // Find the most expensive product
    // Count the total number of items in the cart
    // Convert the cart array into an object lookup by product name

const cart = [
  { name: "Shoes", price: 1200, qty: 2 },
  { name: "Bag", price: 800, qty: 1 },
  { name: "Watch", price: 1500, qty: 3 }
];

const totalValue = cart.reduce((sum, item) => {
  return sum + item.price * item.qty;
}, 0);

console.log(totalValue);

