import express from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    res.redirect("/");

  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});
router.post("/location", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Please login first."
      });
    }

    const {
      deliveryAddress,
      latitude,
      longitude
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        deliveryAddress,
        latitude,
        longitude
      },
      {
        new: true
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    res.json({
      message: "Location saved successfully.",
      deliveryAddress: user.deliveryAddress
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error saving location."
    });
  }
});



export default router;