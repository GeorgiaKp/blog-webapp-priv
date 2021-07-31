const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

async function UserUpdateController(req, res) {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.send("There was an error");
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
}

//UPDATE
router.put("/:id", UserUpdateController)


async function UserDeleteController(req, res) {
  let user;
  try {
    user = await User.findById(req.params.id);
  } catch (err) {
    console.error(err);
    return res.send("User not found!");
  }
  if (req.body.userId !== req.params.id) {
    console.log(401)
    return res.send("You can delete only your account!");
  }
  try {
    console.log(user)
    await Post.deleteMany({ username: user.username });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    console.error(err);
    return res.send("There was an error");
  }
}

//DELETE
router.delete("/:id", UserDeleteController)


async function UserGetController(req, res)  {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
}

//GET USER
router.get("/:id", UserGetController)


// module.exports = {
//   UserGetController,
//   UserUpdateController,
//   UserDeleteController,
//   router
// };

module.exports = router;