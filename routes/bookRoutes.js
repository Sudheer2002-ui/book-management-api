const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.addBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
router.post('/import', upload.single('file'), bookController.importBooks);

module.exports = router;
