const express = require("express");
const mongoose = require("mongoose");
const ShortURL = require("./models/shortURL.js");
const port = 5000 || process.env.PORT;

mongoose.connect("mongodb://localhost:27017/urlShortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const shortURLs = await ShortURL.find();
  res.render("index", { shorturls: shortURLs });
});
app.post("/shorturls", async (req, res) => {
  await ShortURL.create({
    full: req.body.full_URL,
  });

  res.redirect("/");
});
app.get("/:shorturlid", async (req, res) => {
  let id = req.params.shorturlid;

  const shorturlid = await ShortURL.findOne({ short: id });
  if (shorturlid == null) {
    return res.sendStatus(400);
  }

  shorturlid.clicks++;
  shorturlid.save();

  res.redirect(shorturlid.full);
});

app.listen(port, () => {
  console.log("Server Started ........");
});
