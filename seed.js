const Product = require('./models/product');
const mongoose = require('mongoose');

const products = [
    {
        category: 'gadget',
        image: 'https://cdn.shopclues.com/images1/thumbnails/96444/640/1/143365770-96444405-1547996475.jpg',
        name: 'Samsung Galaxy J4 Plus 32 Gb 3 Gb RAM Smartphone',
        desc: 'Free Shipping, Display Size : 6.1 Inches(15.49 Cm), Os Name : Android 8.0 (Oreo), Internal Storage : 32 Gb',
        newPrice: 7799,
        discount: 21,
        oldPrice: 9900,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'gadget',
        image: 'https://cdn.shopclues.com/images1/thumbnails/114509/200/200/152435008-114509485-1624859155.jpg',
        name: 'Dell Inspiron Core i5 11th Gen 4 GB RAM/ 1 TB HDD + 256',
        desc: 'Processor : Core I5, System Memory : 4 Gb, Hdd Capacity : 1 Tb',
        newPrice: 62100,
        discount: 1,
        oldPrice: 63300,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'gadget',
        image: 'https://cdn.shopclues.com/images1/thumbnails/111754/200/200/151311919-111754985-1613117958.jpg',
        name: 'LIONIX T500 Smart Watch 44mm Black Aluminium Black Spor',
        desc: 'Free Shipping, Sim Enabled : No, Voice Calling : Yes, Dial Shape : Rectangular',
        newPrice: 1121,
        discount: 55,
        oldPrice: 2499,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")

    },
    {
        category: 'gadget',
        image: 'https://cdn.shopclues.com/images1/thumbnails/114427/200/200/152399917-114427378-1623755439.jpg',
        name: 'Samsung 65 inch(163 cm) UA65AU9070 Crystal Ultra HD (4K) Smart TV LED (2021 Model)',
        desc: 'Display Size : 55 Inches(139.7 Cm), Functionality : Smart, Display Resolution : Uhd',
        newPrice: 75000,
        discount: 16,
        oldPrice: 90000,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'fashion',
        image: 'https://cdn.shopclues.com/images1/thumbnails/107530/320/1/149970925-107530120-1591429511.jpg',
        name: 'Rayon Design White Printed Gudda Guddiya Anarkali Set',
        desc: 'Free Shipping, Prints & Patterns : Printed, Color Family : White, Set Contents : Single',
        newPrice: 348,
        discount: 78,
        oldPrice: 1599,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'fashion',
        image: 'https://cdn.shopclues.com/images1/thumbnails/88844/320/1/139338853-88844383-1528549057.jpg',
        name: 'Pack of 3 Baremoda Men Multicolor Polo Collar T-Shirt',
        desc: 'Free Shipping, Prints & Patterns : Solid, Color Family : Multicolor',
        newPrice: 503,
        discount: 66,
        oldPrice: 1499,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'fashion',
        image: "data:image/jpeg;base64,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",
        name: "RG Designers Men's Full Sleeve Kurta Pyjama Set AVDoubleHandloom-Orange",
        desc: 'Free Shipping, Prints & Patterns : Solid, Type : Kurta & Pyjama Sets, Length : Long',
        newPrice: 1045,
        discount: 72,
        oldPrice: 3799,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'fashion',
        image: 'https://cdn.shopclues.com/images1/thumbnails/104606/320/1/148868285-104606947-1579591210.jpg',
        name: "FrionKandy Women's Black Cotton Sleeveless Printed A Line Maxi Dress",
        desc: 'Free Shipping, Prints & Patterns : Printed, Color Family : Black, Sleeve Length : Sleeveless',
        newPrice: 285,
        discount: 71,
        oldPrice: 999,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'accessory',
        image: 'https://www.montblanc.com/variants/images/19971654706785105/A/w2500.jpg',
        name: 'Skyline College/School/Office Backpack Bag With Warrant',
        desc: 'Free Shipping, Color : BrownOuter, Material : Polyester, Number of Compartments : 2',
        newPrice: 560,
        discount: 44,
        oldPrice: 1000,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'accessory',
        image: 'https://cdn.shopclues.com/images1/thumbnails/101397/320/1/146863737-101397830-1561102144.jpg',
        name: "Adidas YKING Men's Sports Shoes",
        desc: 'Free Shipping, Type : Running, Color : Black, Upper Material : Mesh',
        newPrice: 1995, 
        discount: 33,
        oldPrice: 2995,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'accessory',
        image: 'https://m.media-amazon.com/images/I/71Ji+cXk9uL._UL1500_.jpg',
        name: "Espoir Analog Blue Dial Day And Date Men's and Boy's Watch - InfiDex0507",
        desc: 'Display : Analog, Strap Material : Leather, Strap Color : Brown',
        newPrice: 342,
        discount: 86,
        oldPrice: 2496,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    },
    {
        category: 'accessory',
        image: 'https://cdn.shopclues.com/images1/thumbnails/96337/320/1/143316903-96337797-1547712550.jpg',
        name: 'Combo of 4 Fogg Deodorant Spray 120 ml Each (Flavours May Vary)',
        desc: 'This perfumed body spray has an invigorating scent which envelops you in a pleasant smell for a long time.',
        newPrice: 475,
        discount: 52,
        oldPrice: 999,
        author: mongoose.Types.ObjectId("61ac159768d6e277db5302f0")
    }
];

async function seed(){
    await Product.insertMany(products);

};

module.exports = seed;