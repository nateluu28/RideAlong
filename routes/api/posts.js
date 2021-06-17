const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const _ = require('lodash');
const Post = require("../../models/Post");
const User = require("../../models/User");
const validatePostInput = require("../../validation/posts");

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

router.get("/search", (req, res) => {
  Post.find(req.data)
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

// protected route to make posts
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      console.log(errors);
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      startLocation: req.body.startLocation,
      endLocation: req.body.endLocation,
      capacity: req.body.capacity,
      numPassengers: req.body.numPassengers,
      createdAt: req.body.createdAt,
      leaveDate: req.body.leaveDate,
      price: req.body.price,
      carMake: req.body.carMake,

      user: req.user.id,
    });

    let savedPost = null;
    newPost.save().then(post=> {
      savedPost = post;
      req.user.posts.push(post)
      console.log(req.user)
      return req.user.save();
    }).then((user) => res.json(savedPost));
  }
);

router.get("/:postId", (req, res) => {
  Post.
    findOne({"_id" : mongoose.Types.ObjectId(req.params.postId)}).
    populate("user").
    populate("passengers").
    exec(function (err, post) {
      if (err) return handleError(err);
      let allowed = ["firstName", "lastName", "username", "requests", "posts"];
      // const filteredObj = _.pick(post.user, allowed)
      post.user = _.pick(post.user, allowed);
      return res.json(post);
    })

});

router.delete('/:postId', function (req, res) {
  console.log(req.params);
  Post.deleteOne({"_id": (req.params.postId)})
    .then(deletedDocument => {
      if(deletedDocument) {
        console.log(`Successfully deleted document that had the form: ${deletedDocument}.`);
      } else {
        console.log("No document matches the provided query.");
      }
      return deletedDocument;
    })  
    .catch(err => console.error(`Failed to find and delete document: ${err}`))
  }
);




module.exports = router;


