const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const booksFile = path.join(__dirname, '../books.json');

// Helper to read books
function readBooks() {
    if (!fs.existsSync(booksFile)) return [];
    const data = fs.readFileSync(booksFile);
    return JSON.parse(data);
}

// Helper to save books
function saveBooks(books) {
    fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));
}

// Get all books
exports.getAllBooks = (req, res) => {
    const books = readBooks();
    res.json(books);
};

// Get single book
exports.getBookById = (req, res) => {
    const books = readBooks();
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
};

// Add new book
exports.addBook = (req, res) => {
    const { title, author, publishedYear } = req.body;
    if (!title || !author || !publishedYear) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const newBook = { id: uuidv4(), title, author, publishedYear: Number(publishedYear) };
    const books = readBooks();
    books.push(newBook);
    saveBooks(books);
    res.status(201).json(newBook);
};

// Update book
exports.updateBook = (req, res) => {
    const { title, author, publishedYear } = req.body;
    const books = readBooks();
    const index = books.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Book not found' });

    books[index] = {
        ...books[index],
        title: title || books[index].title,
        author: author || books[index].author,
        publishedYear: publishedYear ? Number(publishedYear) : books[index].publishedYear,
    };
    saveBooks(books);
    res.json(books[index]);
};

// Delete book
exports.deleteBook = (req, res) => {
    let books = readBooks();
    const index = books.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Book not found' });
    const deleted = books.splice(index, 1);
    saveBooks(books);
    res.json(deleted[0]);
};

// CSV import
exports.importBooks = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const lines = req.file.buffer.toString().split('\n');
    const headers = lines[0].split(',');
    const requiredHeaders = ['title', 'author', 'publishedYear'];
    if (!requiredHeaders.every(h => headers.includes(h))) {
        return res.status(400).json({ error: 'Missing required headers' });
    }

    const books = readBooks();
    const errors = [];
    let addedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].trim();
        if (!row) continue;
        const cols = row.split(',');

        const book = {};
        headers.forEach((h, idx) => {
            book[h.trim()] = cols[idx]?.trim();
        });

        if (!book.title || !book.author || isNaN(book.publishedYear)) {
            errors.push({ row: i + 1, error: 'Invalid or missing data' });
            continue;
        }

        books.push({
            id: uuidv4(),
            title: book.title,
            author: book.author,
            publishedYear: Number(book.publishedYear),
        });
        addedCount++;
    }

    saveBooks(books);
    res.json({ added: addedCount, errors });
};
