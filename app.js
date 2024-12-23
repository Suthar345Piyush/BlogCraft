require('dotenv').config();

const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");





const  app = express();
const PORT = process.env.PORT || 8000;



mongoose.connect(process.env.MONGO_URL).then((e) => {
  console.log("Mongodb is connected");
})

app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// express does not show  directly images or static files so we have to use express.static
app.use(express.static(path.resolve("./public")));

app.get("/" ,  async (req , res) => {

  // sort the blogs  by decending order
  const allBlogs = await Blog.find({});
  res.render("home", 
  {user : req.user,
  blogs : allBlogs,
});
});

app.use("/user" , userRoute);
app.use("/blog" , blogRoute);




app.listen(PORT ,  () => console.log(`Server is  started on PORT:${PORT}`));