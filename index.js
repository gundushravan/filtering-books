const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//Get a specific number of books

app.get("/books/", async (request, response) => {
  const {
    offset = 5,
    limit = 5,
    order = "ASC",
    order_by = "book_id",
    search_q = "",
  } = request.query;
  const getBooksQuery = `
    SELECT
      *
    FROM
     book
    WHERE
     title LIKE '%${search_q}%'
    ORDER BY ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset};`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});
