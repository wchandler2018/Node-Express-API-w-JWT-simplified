const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  registerValidation,
  loginValidation
} = require("../validation/validation");

//route api/user/register  POST request
//register route
//@access Public
router.post("/register", async (req, res) => {
  //validate data from user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if users already exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("This email is already in use.");

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(req.body.password, salt);

  //create new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed_password
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//route api/user/register  POST request
//login route
//@access Public
router.post("/login", async (req, res) => {
  //validate data from user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user exist.
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("please double check the email and password.");

  //check that password is correct
  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword)
    return res.status(400).send("please double check the email and password.");

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
