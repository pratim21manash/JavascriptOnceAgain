//Real Estate Listings – Costliest Property
const properties = [
  { id: 1, price: 4500000 },
  { id: 2, price: 7800000 },
  { id: 3, price: 6200000 }
];

//Find the property with the highest price.
let costlyProperty = properties[0];

for (let i = 1; i < properties.length; i++) {
  if (properties[i].price > costlyProperty.price) {
    costlyProperty = properties[i];
  }
}

console.log(costlyProperty);



//using reduce method
const costlyPropertyy = properties.reduce((max, property) =>
  property.price > max.price ? property : max
);

console.log(costlyPropertyy);
