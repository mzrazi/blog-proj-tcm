

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  user: {
    type: String,
    required: true,
  },
});

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  commentedby: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const articleSchema = new mongoose.Schema({
    author: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      required: true,
    },
    userid:{
      type:String,
      required:true
    },
    comments: [commentSchema],
    ratings: [ratingSchema],
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });
  
  articleSchema.virtual('averageRating').get(function() {
    if (this.ratings.length === 0) {
      return 0;
    } else {
      const sum = this.ratings.reduce((total, rating) => total + rating.value, 0);
      return sum / this.ratings.length;
    }
  });
  

const comment = mongoose.model('comment', commentSchema);
const rating = mongoose.model('rating', ratingSchema);
const article = mongoose.model('article', articleSchema);


//Export the model
module.exports = {comment,rating,article}