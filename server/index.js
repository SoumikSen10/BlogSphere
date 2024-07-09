import express from "express";
const app = express();

import path from "path";

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import cors from "cors";
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(express.json()); //for parsing the json

import mongoose from "mongoose";
import { User } from "./models/User.models.js";
import { Post } from "./models/Post.models.js";

import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);

import cookieParser from "cookie-parser";
app.use(cookieParser());

import multer from "multer";
const uploadMiddleware = multer({ dest: "uploads/" });
import fs from "fs";
import bodyParser from "body-parser";
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serving static files from the "uploads" folder
app.use("/uploads", express.static("uploads"));
/* import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "uploads"))); */

/* import { connectDB } from "./db/index.js"; */

/* connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!", err);
  }); */

mongoose.connect(
  "mongodb+srv://mastersoumik2003:blogsphere@cluster0.xaxviwb.mongodb.net/"
);

// Route to handle user registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Create a new user document
    console.log(bcrypt.hashSync(password, salt));
    let password2 = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      password: password2,
    });
    // Save the user document to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

app.post("/login", async (req, res) => {
  console.log("login testing");
  const { username, password } = req.body;
  console.log(req.body);
  const loggedUser = await User.findOne({ username });
  console.log(loggedUser);
  const confirmation = bcrypt.compareSync(password, loggedUser.password);
  console.log(confirmation);
  if (confirmation) {
    console.log("confirmation testing");
    //logged in
    jwt.sign(
      { username, id: loggedUser._id },
      process.env.SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: loggedUser._id,
          username,
        });
        // console.log(res.cookie);
      }
    );
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token; // Check if the token exists in cookies
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }
  jwt.verify(token, process.env.SECRET, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Token invalid" }); // Handle invalid token
    }
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { title, summary, content } = req.body;

  //middlewares stores file in uploads folder, rest part for file renaming and format preserving
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Token invalid" }); // Handle invalid token
    }
    try {
      const newPost = new Post({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      await newPost.save();
      res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
      console.error("Error in creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }

    //res.json({ ext });
  });
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", ["username"]) // Correct usage of populate()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("author", "username");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post" });
  }
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: "Token invalid" }); // Handle invalid token
      }

      const { id, title, summary, content } = req.body;

      // Check if the post exists
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user is the author of the post
      const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json({ message: "You are not the author" });
      }

      // Update the post
      post.title = title;
      post.summary = summary;
      post.content = content;
      post.cover = newPath ? newPath : post.cover;

      // Save the updated post
      await post.save();

      res.status(200).json({ message: "Post updated successfully", post });
    });
  } catch (error) {
    console.error("Error in updating post:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
});

// DELETE route to delete a post
app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: "Token invalid" });
      }

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const isAuthor = post.author.toString() === info.id.toString();
      if (!isAuthor) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this post" });
      }

      await Post.findByIdAndDelete(id);
      res.status(200).json({ message: "Post deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening to app at PORT ${process.env.PORT}`);
});
