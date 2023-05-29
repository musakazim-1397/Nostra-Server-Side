const Product = require("../Models/Product");
const User = require("../Models/User");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: "doftqoqcu",
  api_key: "661627151578491",
  api_secret: "Zbk9_3gCbgWhTJl73uOEv4Yqu9I",
});

exports.addProduct = async (req, res) => {
  //first upload the image to cloudinary and then save the product
  try {
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path);
    }); //upload promises
    const uploadedImages = await Promise.all(uploadPromises); //upload results

    // Extract the URLs of uploaded images
    const imageUrls = uploadedImages.map((image) => image.secure_url);

    console.log(req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        imageUrls: imageUrls,
        userId: req.body.user,
        usersWhoBought: [],
        category: req.body.category,
        productDate: req.body.date,
        productQuantity: req.body.quantity,
      });
      product
        .save()
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          res.status(400).json({ error: err });
        });

      User.findById(req.body.user).then((user) => {
        user.products.push(product);
        user.save();
      });

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

    req.files.map((file) =>
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log("file deleted");
        }
      })
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to upload images and saving product" });

    req.files.map((file) =>
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log("file deleted");
        }
      })
    );
  }
};

exports.getProduct = (req, res) => {
  Product.findById(req.params.id)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.getAllProducts = (req, res) => {
  Product.find()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.getProductByName = (req, res) => {
  Product.find({ name: req.params.name })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.getNewArrivals = (req, res) => {
  Product.find()
    .sort({ productDate: -1 })
    .limit(6)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.getMostPopular = (req, res) => {
  Product.find()
    .sort({ usersWhoBought: -1 })
    .limit(6)
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.getMyProducts = (req, res) => {
  Product.find({ userId: req.params.id })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.saveEditedProduct = async (req, res) => {
  console.log(req.body);
  if(req.files){
    console.log('this is the req.files',req.files);
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path);
    }); //upload promises
    const uploadedImages = await Promise.all(uploadPromises); //upload results
    const imageUrls = uploadedImages.map((image) => image.secure_url);
    if(req.body.image1Url){
      imageUrls.push(req.body.image1Url);
    }
    if(req.body.image2Url){
      imageUrls.push(req.body.image2Url);
    }
    if(req.body.image3Url){
      imageUrls.push(req.body.image3Url);
    }
    if(req.body.image4Url){
      imageUrls.push(req.body.image4Url);
    }

  Product.findById(req.params.id)
    .then((product) => {
      console.log('product fetched from Db',product)
      product.name = req.body.name;
      product.description = req.body.description;
      product.price = req.body.price;
      product.category = req.body.category;
      product.productQuantity = req.body.quantity;
      product.productDate = req.body.date;
      product.imageUrls = imageUrls;
      product.save().then(result => res.status(200).json(result));
    })
    .catch((err) => res.status(400).json({ error: "couldn;t find the product"+err }));
  }else{
    Product.findById(req.params.id)
    .then((product) => {
      let uploadedImageUrls = [...product.imageUrls];
      if(req.body.image1Url){
        uploadedImageUrls.push(req.body.image1Url);
      }
      if(req.body.image2Url){
        uploadedImageUrls.push(req.body.image2Url);
      }
      if(req.body.image3Url){
        uploadedImageUrls.push(req.body.image3Url);
      }
      if(req.body.image4Url){
        uploadedImageUrls.push(req.body.image4Url);
      }
      product.name = req.body.name;
      product.description = req.body.description;
      product.price = req.body.price;
      product.category = req.body.category;
      product.productQuantity = req.body.quantity;
      product.productDate = req.body.date;
      product.imageUrls= uploadedImageUrls;
      product.save().then(result => res.status(200).json(result));
    })
    .catch((err) => res.status(400).json({ error: "couldn't find the product"+err }));
  }

  req.files.map((file) =>
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
          return;
        } else {
          console.log("file deleted");
        }
      })
    );
};


exports.deleteProduct = async (req, res) => {

  const session = await mongoose.startSession();
    session.startTransaction();
    try{
      await Product.findByIdAndDelete(req.params.id)
    User.findById(req.body.user).then((user) => {
      user.products.pull(req.params.id);
      return user.save();
    });
    await session.commitTransaction();
      session.endSession();
      res.status(200).json({message:'product deleted'});
      
    }
    catch(error){
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  
}
