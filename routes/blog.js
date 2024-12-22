const Router = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId : req.params.id}).populate("createdBy");
    console.log("blog" , blog);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).send("Error fetching blog");
  }
});


// blogid  routes
router.post("/comment/:blogId" , async(req , res) => {
  await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single('coverImage'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      title,
      body,
      coverImageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });

    // Fixed: Using backticks for string interpolation
    return res.redirect(`/blog/${blog._id}`);
    // The error was here ↑ - Changed from '/blog/${blog._id}' to `/blog/${blog._id}`
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).send("Error creating blog post");
  }
});

module.exports = router;
