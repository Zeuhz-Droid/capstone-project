const morgan = require('morgan');
const express = require('express');
const limoRouter = require('./routes/limoRouter');
const { signup, login, verify } = require('./controllers/authController');

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

const info = {
  data: {
    username: null,
    shortenedLimo: null,
    error: null,
    valid: null,
    qr_code: null,
    history: null,
  },
};

// Render the index page
app.get('/', verify, (req, res) => {
  info.data.username = req.user.username;
  info.data.history = req.user.limos;
  res.render('index', info);
});

app.post('/signup', signup, (req, res) => {
  info.data.valid = 'Please Log in.';
  res.render('login', info);
});

app.post('/login', login);

app.use('/api/v1/', verify, limoRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log(`app is listening on port : ${process.env.PORT}`);
});
