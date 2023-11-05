const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");
const _=require("lodash");


mongoose.connect("mongodb+srv://dragoongamer16:yash9274@cluster0.bklivt9.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome! to your ToDoList",
});

const item2 = new Item({
  name: "Hit the + button to add new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});
const defaultItems = [item1, item2, item3];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  async function List() {
    const list = await Item.find({});
    // console.log(list);
    if (list.length === 0) {
      Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      const day = date.getDate();
      res.render("list", { listTitle: day, listNewItems: list });
    }
  }
  List();
});

app.get("/:path", function (req, res) {
  const newPath = _.capitalize(req.params.path);
  async function myfunc1(Var) {
    const list = await List.findOne({ name: Var });
    if (!list) {
      const newList = new List({
        name: Var,
        items: defaultItems,
      });
      newList.save();
      res.redirect("/" + Var);
    } else {
      res.render("list", { listTitle: list.name, listNewItems: list.items });
    }
  }
  myfunc1(newPath);
});

app.post("/", function (req, res) {
  async function myfunc() {
    const item = req.body.newItem;
    const root=req.body.list;
    if (item.length != 0) {
      const newItem = new Item({
        name: item,
      });
      if (date.getDate() === root) {
        newItem.save();
        res.redirect("/");
      } else {
        const temp=await List.findOne({name:root});
        temp.items.push(newItem);
        temp.save()
        res.redirect("/"+root);
      }
    }
  }
  myfunc();
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/delete", function (req, res) {
  const Id=req.body.box;
  const root=req.body.listName
  async function del(id) {
    if (date.getDate() === root) {
      await Item.findByIdAndDelete(id);
      res.redirect("/");
    } else {
      await List.findOneAndUpdate({name:root},{$pull:{items:{_id:id}}})
      res.redirect("/"+root);
    }    
    
  }
  del(Id);
  
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
