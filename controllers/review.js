const Product = require('../models/product');
const Review = require('../models/review');


module.exports.createReview = async(req,res) => {
    
    try{
        const { productid } = req.params;
        const product = await Product.findById(productid).populate('reviews');
    
    
        const review = new Review({...req.body, reviewAuthor: req.user._id});
        await review.save();
    
    
        product.reviews.push(review);
        await product.save();   
    
        let cnt = 0;
        let sum = 0;
        for (let review of product.reviews){
            sum = sum + review.rating;
            cnt++;
        }   
    
        await Product.updateOne({ _id: productid }, { avgRating: Math.floor(sum/cnt) });
    
        
        req.flash('success','Review added successfully!!!');

        res.redirect(`/products/${productid}`);
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }
     
    
}

module.exports.deleteReview = async(req,res) => {

    try{
        const { productid, reviewid } = req.params;

        await Review.findByIdAndDelete(reviewid);
        await Product.updateOne({ _id: productid }, { $pull: { reviews: reviewid } });
    
        const product = await Product.findById(productid).populate('reviews');
        let cnt = 0;
        let sum = 0;
        for (let review of product.reviews){
            sum = sum + review.rating;
            cnt++;
        }   
        if (cnt === 0){
            await Product.updateOne({ _id: productid }, { avgRating: 0 });
        }
        else{
            await Product.updateOne({ _id: productid }, { avgRating: Math.floor(sum/cnt) });
        }
    

        req.flash('error','Review deleted successfully!!!');

        res.redirect(`/products/${productid}`);
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }
}