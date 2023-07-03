const morgan = require('morgan');
const express = require('express');
const limoRouter = require('./routes/limoRouter');
const { signup, login, verify } = require('./controllers/authController');

require('dotenv').config();

const connectToDatabase = require('./server');
const app = express();
const bodyparser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

connectToDatabase();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for XiXuZ',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It is a link shortening app.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'zeuhz droid',
      url: 'https://github.com/Zeuhz-Droid',
    },
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
    },
    {
      url: 'https://xixuz.onrender.com',
      description: 'Production seerver',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

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

app.get('/signup', (req, res) => {
  res.render('signup', info);
});

app.post('/signup', signup, (req, res) => {
  info.data.valid = 'Please Log in.';
  res.render('login', info);
});

app.get('/login', (req, res) => {
  res.render('login', info);
});

app.post('/login', login);

app.use('/api/v1/', verify, limoRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT || 8000, () => {
  console.log(`app is listening on port : ${process.env.PORT}`);
});
