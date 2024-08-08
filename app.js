const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload').router;

const app = express();


mongoose.connect('mongodb+srv://test:test@picshare.78uzh.mongodb.net/?retryWrites=true&w=majority&appName=PICSHARE ')
   .then(() => console.log('Connection success'))
  .catch(err => console.error('Connection error', err));


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.use('/', indexRouter);
app.use('/upload', uploadRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
