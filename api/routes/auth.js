const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


async function RegisterPostController(req, res) {
  let hashedPass;
  try {
    const salt = await bcrypt.genSalt(10);
    hashedPass = await bcrypt.hash(req.body.password, salt);
  } catch (err) {
    return res.status(500).json("There was an error!");
  }
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(422).json("Couldn't create user");
  }
}

//REGISTER
router.post("/register", RegisterPostController);


async function LoginPostController(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username },{},{lean:true});
    if (!user) return res.status(403).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) return res.status(403).json("Wrong credentials!");

    const { password, ...others } = user;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("There was an error");
  }
}

//LOGIN
router.post("/login", LoginPostController);

module.exports = {
  RegisterPostController,
  LoginPostController,
  router
};
