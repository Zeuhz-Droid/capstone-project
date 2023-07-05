const mongoose = require('mongoose');
const { string } = require('vrandom');

const limoSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: [true, 'limo must have url'],
  },
  shortened_url: {
    type: String,
  },
  custom_url: {
    type: String,
  },
  analytics: {
    type: Number,
    default: 0,
  },
  qr_code: {
    type: String,
    // data: Buffer,
  },
  date_created: {
    type: String,
  },
  limo_lastModifiedAt: Date,
  limo_history: {
    type: Array,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
});

limoSchema.methods.updateAnalytics = async function () {
  this.analytics = this.analytics + 1;
};

limoSchema.pre('save', function (next) {
  const date = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayofWeek = daysOfWeek[String(date.getDay())];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const amOrpm = hours < 12 ? 'AM' : 'PM';

  this.date_created = `${dayofWeek} ${day}/${month}/${year} ${hours}:${minutes}${amOrpm}`;

  next();
});

limoSchema.pre('save', function (next) {
  if (!this.isModified('shortened_url')) return next();

  // set modification date
  this.limo_lastModifiedAt = Date.now();

  // push update into history array
  this.limo_history.push({
    date_modified: this.limo_modifiedAt,
    current_url: this.shortened_url,
  });

  next();
});

limoSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'username' });

  next();
});

const Limo = mongoose.model('Limo', limoSchema);

module.exports = Limo;
