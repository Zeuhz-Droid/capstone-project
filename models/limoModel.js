const mongoose = require('mongoose');

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
    default: function () {
      const date = new Date();
      const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      return date.toLocaleDateString('en-US', options);
    },
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
