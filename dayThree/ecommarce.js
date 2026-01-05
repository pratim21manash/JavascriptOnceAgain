const cartItems = [
  { productId: "p101", name: "Shoes", price: 2000, qty: 2 },
  { productId: "p102", name: "Bag", price: 1500, qty: 1 },
  { productId: "p101", name: "Shoes", price: 2000, qty: 1 }
];


// let groupCart = {};

// for(let i = 0; i < cartItems.length; i++){
//     let item = cartItems[i]
//     let productId = item.productId

//     if(groupCart[productId]){
//         groupCart[productId].push(item)
//     }else{
//         groupCart[productId] = [item]
//     }
// }

// console.log(groupCart)




const cartLookup = cartItems.reduce((acc, item) => {
    const { productId } = item;

    if(!acc[productId]){
        acc[productId] = []
    }

    acc[productId].push(item);
    return acc
}, {})

console.log(cartLookup)