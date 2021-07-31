const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


async function RegisterPostController(req, res) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
}

//REGISTER
router.post("/register", RegisterPostController);


async function LoginPostController(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400)

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) return res.status(400)

    const { password, ...others } = user.toJSON();
    res.status(200).json(others);
  } catch (err) {
    console.error(err);
    res.send("There was an error");
  }
}

//LOGIN
router.post("/login", LoginPostController);

// module.exports = {
//   RegisterPostController,
//   LoginPostController,
//   router
// };
module.exports = router;