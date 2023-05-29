const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imageUrls:[String],
    category: String,
    productDate: Date,
    productQuantity: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    usersWhoBought: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model("Product", ProductSchema);