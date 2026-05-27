import express from "express";
import User from "../models/user.model.js";

const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
       return res.redirect("/");
    }

    await User.create({
      name,
      email,
      password,
    });

   res.render("signin", {
      name,
      showLogin: true
    });

  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("User not found");
    }

    if (user.password !== password) {
      return res.send("Wrong password");
    }

    res.redirect("/");

  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

export default router;