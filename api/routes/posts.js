const router = require("express").Router();
const Post = require("../models/Post");

async function PostCreateController(req, res) {
  const newPost = new Post(req.body);
  // console.log("np",newPost)
  try {

    const savedPost = await newPost.save();
    // console.log("sp",savedPost)
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json("There was an error");
  }
}

//CREATE POST
router.post("/", PostCreateController)


async function PostUpdateController(req, res) {
  let post;
  try {
    post = await Post.findById(req.params.id);
  } catch (err) {
    return res.status(500).json("There was an error!");
  }
  if (post.username !== req.body.username) {
    return res.status(401).json("You can update only your posts!");
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
    res.status(500).json("There was an error");
  }
}

//UPDATE POST
router.put("/:id", PostUpdateController)

async function PostDeleteController(req, res) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    // console.log("22ee",post)
  } catch (err) {
    return res.status(404).json("There was an error");
  }
  if (post.username !== req.body.username) {
    return res.status(401).json("You can delete only your posts!");
  }
  try {
    console.log("br",post.delete())
    await post.delete();
    res.status(200).json("Post has been deleted...");
  } catch (err) {
    res.status(500).json("There was an error");
  }
}

//DELETE POST
router.delete("/:id", PostDeleteController)


async function PostGetController(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json("There was an error");
  }
}
//GET POST
router.get("/:id", PostGetController)


async function AllPostsGetController(req, res) {
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
    res.status(500).json("There was an error");
  }
}
//GET ALL POSTS
router.get("/", AllPostsGetController)

module.exports = {
  PostCreateController,
  PostUpdateController,
  PostDeleteController,
  PostGetController,
  AllPostsGetController,
  router
};
