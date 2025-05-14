const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/books', bookRoutes);
app.use(errorHandler);

module.exports = app;
