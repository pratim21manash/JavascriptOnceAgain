//Sales Team Performance – Highest Salesperson
const salesPeople = [
  { name: "Amit", totalSales: 120000 },
  { name: "Neha", totalSales: 175000 },
  { name: "Rahul", totalSales: 98000 }
];

//Find the salesperson with the highest sales.
let topSeller = salesPeople[0];

for (let i = 1; i < salesPeople.length; i++) {
  if (salesPeople[i].totalSales > topSeller.totalSales) {
    topSeller = salesPeople[i];
  }
}

console.log(topSeller);


//using reduce method
const topSellerr = salesPeople.reduce((max, person) =>
  person.totalSales > max.totalSales ? person : max
);

console.log(topSellerr);
