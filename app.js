const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const wikiSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", wikiSchema);




app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, results) {
      if (err) {
        res.send(err);
      } else {
        res.send(results);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added an article")
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all artickes.");
      }
    });
  });






app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, result) {
      if (result) {
        res.send(result);
      } else {
        res.send("Sorry, but no article found");
      }
    })
  })
  .put(function(req, res) {
    Article.replaceOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated article");
        }
      })
  })
  .patch(function(req, res) {
    Article.updateOne({
          title: req.params.articleTitle
        },
       {
          content: req.body.content
        },
        function(err){
          if(err){
            res.send(err);
          }
          else{
            res.send("Updated part of article");
          }
        }
      )
  })
  .delete(function(req, res){
    Article.deleteOne({
      title: req.params.articleTitle},
      function(err){
        if(err){
          res.send(err);
        }
        else{
          res.send("Successfully deleted an article");
        }
      }
    )
  });





app.listen(3000, function() {
  console.log("App is running on port 3000");
});
