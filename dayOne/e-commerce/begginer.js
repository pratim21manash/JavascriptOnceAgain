const cart = [
  { name: "Shoes", price: 1200, qty: 2 },
  { name: "Bag", price: 800, qty: 1 },
  { name: "Watch", price: 1500, qty: 3 }
];

// total cart value
let totalValue = 0;

for (let i = 0; i < cart.length; i++) {
  totalValue += cart[i].price * cart[i].qty;
}

console.log(totalValue);


// Find the most expensive product
let expensiveItem = cart[0];

for (let i = 1; i < cart.length; i++) {
  if (cart[i].price > expensiveItem.price) {
    expensiveItem = cart[i];
  }
}

console.log(expensiveItem);



// Count the total number of items in the cart
let totalItems = 0;

for (let i = 0; i < cart.length; i++) {
  totalItems += cart[i].qty;
}

console.log(totalItems);
