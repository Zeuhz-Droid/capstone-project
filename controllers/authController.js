const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Limo = require('../models/limoModel');
const jwt = require('jsonwebtoken');

const sendToken = (token, res) => {
  // create cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //   set cookie secure to "true" when out of development
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  //   send cookie to client side
  res.cookie('jwt', token, cookieOptions);
};

exports.signup = async (req, res, next) => {
  try {
    // catch user details
    const { username, email, password } = req.body;

    // hash user password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // save new user to database
    await user.save();

    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res, next) => {
  try {
    // catch user details
    const { email, password } = req.body;

    // find user via email
    const user = await User.findOne({ email });

    // if user isn't found
    if (!user) {
      res.render('login', {
        data: {
          error: 'User with this email not found, Try signing up.',
        },
      });
      return;
    }

    // compare passwords
    if (!bcrypt.compare(password, user.password)) {
      res.render('login', {
        data: { error: 'Incorrect email or password...' },
      });
    }

    // create and sign token key
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    //send user signed token
    sendToken(token, res);

    // redact user password
    user.password = undefined;

    // find user link history to next middleware
    const limos = await Limo.find({ user: user.id });

    // render index page with user info
    res.render('index', {
      data: {
        username: user.username,
        history: limos,
      },
    });

    return;
  } catch (err) {
    // send error message
    res.status(500).json({ error: `Error Logging In: ${err}` });
  }
};

exports.verify = async (req, res, next) => {
  try {
    //  get the token from user header authorisation obj

    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.headers.cookie?.split('=')[1] ||
      req.query.token ||
      req.cookies.token;

    //   check for token
    if (!token) {
      res.render('login', {
        data: { valid: 'Please log in.' },
      });
      return;
    }

    // decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // find user
    const user = await User.findById(decoded.id);

    // find links from user
    const limos = await Limo.find({ user: user.id });

    // save user to req obj
    user.limos = limos;
    req.user = user;

    next();
  } catch (error) {
    res.render('login', { data: { valid: `please log in.` } });
  }
};
