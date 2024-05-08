import express from "express";
const app = express();

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const corsOptions = {
  origin: "http://example.com",
};

import cors from "cors";
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(express.json()); //for parsing the json

import mongoose from "mongoose";
import { User } from "./models/User.models.js";

import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);

import cookieParser from "cookie-parser";
app.use(cookieParser());

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

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening to app at PORT ${process.env.PORT}`);
});
