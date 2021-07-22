const router = require("express").Router();
const Post = require("../models/Post");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  let post;
  try {
    post = await Post.findById(req.params.id);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
  if (post.username !== req.body.username) {
    return res.status(401).json("You can update only your post!");
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id,
      { 
        $set: req.body, 
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  let post;
  try {
    post = await Post.findById(req.params.id);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
  if (post.username !== req.body.username) {
    console.log(401)
    return res.send("You can delete only your post!");
  }
  try {
    await post.delete();
    res.status(200).json("Post has been deleted...");
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
});

module.exports = router;