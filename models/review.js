const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    reviewAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;