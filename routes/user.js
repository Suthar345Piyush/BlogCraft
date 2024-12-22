const Router = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin" , (req, res) => {
  return res.render("signin");
});

router.get("/signup" , (req , res) => {
  return  res.render("signup");
});
// creating the  signin route  to give the  access to the  old  user using  the  old  id and  password 
// basically authenticating  the old user
// Example sign-in route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token" , token).redirect("/");
  } catch (error) {
    return res.render("signin" , {
      error : "Invalid email or password",
    });
  }
});

router.get("/logout" , (req , res) => {
  res.clearCookie("token").redirect("/");
})



// creating a  new user using  signup route
router.post("/signup" , async(req , res) => {
  const {fullName , email , password} = req.body;
  await User.create({fullName , email , password});
  return res.redirect("/");
});

module.exports = router;
