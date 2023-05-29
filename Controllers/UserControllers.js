const User = require("../Models/User");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "doftqoqcu",
  api_key: "661627151578491",
  api_secret: "Zbk9_3gCbgWhTJl73uOEv4Yqu9I",
});

exports.addUserEmailPassword = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    res
      .status(400)
      .json({ message: "User already exists", user: existingUser });
    console.log("user already exists");
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log("file deleted");
      }
    });
  } else {
    // console.log(req.body);
    // console.log(req.file);
    let imgRes = await cloudinary.uploader.upload(req.file.path, {
      public_id: req.file.originalname,
    });
    //  console.log(imgRes);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      picture: imgRes.secure_url,
      products: [],
      cart: [],
      orders: [],
    });
    user
      .save()
      .then((result) => {
        res
          .status(200)
          .json({
            user: result.name,
            email: result.email,
            picture: result.picture,
            id: result._id,
            products: result.products,
            cart: result.cart,
            orders: result.orders,
          });
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(err);
            return;
          } else {
            console.log("file deleted");
          }
        });
      })
      .catch((err) => {
        res.status(400).json(err);
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(err);
            return;
          } else {
            console.log("file deleted");
          }
        });
      });
  }
};

exports.loginUserEmailPassword = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  // console.log('existingpass'+ existingUser.password,"req.body"+ req.body.password);
  // console.log('name'+ existingUser.name,)
  // console.log(existingUser)
  // console.log(req.body.password)
  // console.log(existingUser.password===req.body.password)
  if (existingUser) {
    const passwordMatch = existingUser.password === req.body.password;
    if (passwordMatch) {
      res.status(200).json({
        name: existingUser.name,
        email: existingUser.email,
        picture: existingUser.picture,
        id: existingUser._id,
        products: existingUser.products,
        cart: existingUser.cart,
        orders: existingUser.orders,

      });
    } else {
      res.status(400).json({ message: "Password does not match" });
    }
  } else {
    res.status(400).json({ message: "User does not exist" });
  }
};

exports.addUserGoogle = (req, res) => {
  User.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      res.status(200).json({
        name: result.name,
        email: result.email,
        picture: result.picture,
        id: result._id,
        products: result.products,
        cart: result.cart,
        orders: result.orders,

      });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        picture: req.body.picture,
        products: [],
        cart: [],
        orders: [],
      });
      user
        .save()
        .then((result) => {
          res.status(200).json({
            name: result.name,
            email: result.email,
            picture: result.picture,
            id: result._id,
            products: result.products,
            cart: result.cart,
            orders: result.orders,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });
};

exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .populate("products")
    .populate("cart")
    .populate("orders")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getMyProducts = (req, res) => {
  User.findById(req.params.id)
    .populate("products")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}
