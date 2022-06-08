const Product = require("../models/product");


module.exports.showAllProducts = async(req,res) => {
    try{
        const products = await Product.find();
        res.render('./products/index',{ products });
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }

}

module.exports.productForm =  (req,res) => {
    try{
        res.render('./products/new');
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }
}

module.exports.createProduct = async(req,res) => {
    try{
        const { oldPrice, newPrice } = req.body;
        const discount = Math.floor(((oldPrice-newPrice)*100)/oldPrice);
        await Product.insertMany({ ...req.body, discount, author: req.user._id });
        req.flash('success','Added your product successfully!!!');
        res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }
}

module.exports.showProduct = async(req,res) => {
    try{
        const { productid } = req.params;
        const product = await Product.findById(productid).populate({
            path: 'reviews',
            populate: {
                path: 'reviewAuthor'
            }
        });   

        res.render('./products/show',{ product });
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }
}

module.exports.buyNow = (req,res) => {
    res.redirect(`/products/${req.params.productid}`);
}

module.exports.editForm = async(req,res) => {
    try{
        const { productid } = req.params;
        const product = await Product.findById(productid);
        res.render('./products/edit',{ product });
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }

}

module.exports.updateProduct = async(req,res) => {
    try{
        const { productid } = req.params;
        const { oldPrice, newPrice } = req.body;
        const discount = Math.floor(((oldPrice-newPrice)*100)/oldPrice);
        await Product.findByIdAndUpdate(productid,{ ...req.body, discount, author: req.user._id });

        req.flash('success','Edited your product successfully!!!');
        res.redirect(`/products/${productid}`);
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }

    
}

module.exports.deleteProduct = async(req,res) => {
    try{
        const { productid } = req.params;
        await Product.findByIdAndDelete(productid);

        req.flash('error','Deleted your product successfully!!!');
        res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error', { err: e.message });
    }

}