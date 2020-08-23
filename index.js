const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 5001;
const mongoose = require("mongoose");

try {
  mongoose.connect(
    "mongodb+srv://killer:bmEU6SzDNkLeEQIc@cluster0.jqjgo.mongodb.net/url?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected")
  );
} catch (error) {
  console.log("could not connect");
}
mongoose.set("useCreateIndex", true);
app.use(bodyParser.urlencoded({ extended: true }));
const { UrlModel } = require("./models/urlshort");
app.use(cors());
app.use(express.static("images"));
app.set("view engine", "ejs");
//app.set("title", "URL-shortener");
app.listen(port, () => {
  console.log("your app is listening in", port);
});
app.get("/", function (req, res) {
  let allUrl = UrlModel.find(function (err, data) {
    console.log("renderresult", data, port);
    res.render("home", {
      urlResult: data,
      PORT: port,
    });
  });
});
app.post("/createurl", function (req, res) {
  console.log(UrlGenerator());
  let UrlShort = new UrlModel({
    longUrl: req.body.longurl,
    shortUrl: UrlGenerator(),
  });

  UrlShort.save(function (err, data) {
    if (err) throw err;
    console.log(data);
    res.redirect("/");
  });
});
app.get("/:urlId", function (req, res) {
  UrlModel.findOne({ shortUrl: req.params.urlId }, function (err, data) {
    if (err) throw err;
    res.redirect(data.longUrl);
  });
});
app.get("/delete/:id", function (req, res) {
  UrlModel.findByIdAndDelete({ _id: req.params.id }, function (err, data) {
    if (err) throw err;
    res.redirect("/");
  });
});
function UrlGenerator() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var characterLength = characters.length;
  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characterLength));
  }
  console.log(result);
  return result;
}
