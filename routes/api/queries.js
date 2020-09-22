const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//query model
const Query = require("../../models/Query");
//profile model
const Profile = require("../../models/Profile");
//vaidation
const validatePostInput = require("../../validation/post");

//@route GET api/queries/test
//@desc Tests posts route
//@access public
router.get("/test", (req, res) => res.json({ msg: "Query Works" }));

//@route POST api/posts
//@desc Get all posts
//@access public
router.get("/", (req, res) => {
  Query.find()

    .sort({ date: -1 })
    .then((query) => res.json(query))
    .catch((err) =>
      res.status(404).json({ noqueriesfound: "no queries found" })
    );
});

//@route POST api/posts
//@desc insert a post
//@access public
router.post("/", (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  //Check validation

  if (!isValid) {
    //if any errors, send 400 with errors
    return res.status(400).json(errors);
  }

  const newQuery = new Query({
    text: req.body.text,
    name: req.body.name,
    date: req.body.data,
  });

  newQuery.save().then((post) => res.json(post));
});

//@route DELETE api/queries/:id
//@desc Delete query
//@access private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((Profile) => {
      Query.findById(req.params.id)
        .then((Query) => {
          //delete
          Query.remove().then(() => res.json({ success: "true" }));
        })
        .catch((err) =>
          res.status(404).json({ PostNotFound: "Query not found for the id" })
        );
    });
  }
);

//@route UPDATE api/queries/:id
//@desc UPDATE query
//@access private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const queryFields = {};
    queryFields.user = req.user.id;
    if (req.body.text) queryFields.text = req.body.text;
    if (req.body.name) queryFields.name = req.body.name;

    query.findOne({ user: req.user.id }).then((query) => {
      if (query) {
        // Update
        query
          .findOneAndUpdate(
            { user: req.user.id },
            { $set: queryFields },
            { new: true }
          )
          .then((query) => res.json(query));
      } else {
        // Create

        // Check if handle exists
        query.findOne({ handle: queryFields.handle }).then((query) => {
          if (query) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          // Save query
          new query(queryFields).save().then((query) => res.json(query));
        });
      }
    });
  }
);

module.exports = router;
