const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./Routes/routes");
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(routes);

mongoose
  .connect(
    `mongodb+srv://${process.env.MongoDB_UserName}:${process.env.MongoDB_password}@cluster0.bkrr8.mongodb.net/MyAmazonStore?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
