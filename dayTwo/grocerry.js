const groceries = [
  { name: "Rice", price: 60 },
  { name: "Oil", price: 180 },
  { name: "Sugar", price: 45 },
  { name: "Almonds", price: 650 }
];

//solved with basic loop
let expensiveItem = groceries[0];

for (let i = 1; i < groceries.length; i++) {
  if (groceries[i].price > expensiveItem.price) {
    expensiveItem = groceries[i];
  }
}

console.log(expensiveItem);



//optimizeds using reduce method
const mostexpensiveItem = groceries.reduce((max, item) =>
  item.price > max.price ? item : max
);

console.log(mostexpensiveItem);
