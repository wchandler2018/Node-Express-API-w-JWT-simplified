const router = require("express").Router();
const verify = require("./verfiyToken");
//route api/users  GET request
//users route
//@access Private
router.get("/", verify, (req, res) => {
  res.json({ users: { name: "William", title: "just testing jwt" } });
});

module.exports = router;
