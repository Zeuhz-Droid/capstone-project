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
    type: Date,
    default: Date.now(),
  },
  limo_lastModifiedAt: Date,
  limo_history: {
    type: Array,
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

const Limo = mongoose.model('Limo', limoSchema);

module.exports = Limo;
