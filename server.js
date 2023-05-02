//setting up the server
require('dotenv').config();
const express = require("express");
const bp = require("body-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser({ urlencoded: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

//
//connecting and creating a database
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hl6wk8j.mongodb.net/Snippet`).then(()=>console.log("Database Connected"));
const snippetSchema = mongoose.Schema({
  id: String,
  text: String,
});
const Snippet = mongoose.model("Snippet", snippetSchema);
//
//get , post requests
//
app.get("/", (req, res) => {
  res.render("main");
});
//
//sending feature
//
app.get("/send", (req, res) => {
  res.render("send");
});
let randomid;
app.post("/send", (req, res) => {
  randomid = Math.random()
    .toString(36)
    .substring(2, 6 + 2);
  const snippet = new Snippet({
    id: randomid,
    text: req.body.text,
  });
  snippet.save();
  res.redirect("/sent");
});
app.get("/sent", (req, res) => {
  res.render("sent", { uid: randomid });
});
//
//recieving feature
//
app.post("/", (req, res) => {
  res.redirect("/" + req.body.uid);
});
app.get("/:uid", (req, res) => {
  let uid = req.params["uid"];
  console.log(uid);
  Snippet.find({ id: uid }).then((x) => {
    if (x[0] !== undefined) {
      res.render("result", { text: x[0].text });
    }
    else{res.render("error")}
  });
});
app.listen(process.env.PORT||3000, () => {
  console.log("Listening to port");
});
//
