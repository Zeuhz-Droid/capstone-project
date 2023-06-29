const morgan = require('morgan');
const express = require('express');
const limoRouter = require('./routes/limoRouter');

require('dotenv').config();

const connectToDatabase = require('./server');
const app = express();
const bodyparser = require('body-parser');

connectToDatabase();

//  use morgan to view requests types
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

app.use(express.static('public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Render the index page
app.get('/', (req, res) => {
  res.render('index', { data: { shortenedLimo: null, error: null } });
});

app.use('/api/v1/', limoRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log(`app is listening on port : ${process.env.PORT}`);
});
