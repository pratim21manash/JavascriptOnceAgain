// Library Book Tracking – Longest Book

const books = [
  { title: "Book A", pages: 220 },
  { title: "Book B", pages: 540 },
  { title: "Book C", pages: 310 }
];

//Find the book with the highest number of pages
let longestBook = books[0];

for (let book of books) {
  if (book.pages > longestBook.pages) {
    longestBook = book;
  }
}

console.log(longestBook);


//using reduce method
const mostlongestBook = books.reduce((max, book) =>
  book.pages > max.pages ? book : max
);

console.log(mostlongestBook);
