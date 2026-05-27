import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { connectMongoDB } from "./connection.js";
import userrouter from "./routes/user.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
//import User from "./models/user.model.js";

const app = express();
app.use(express.json());
app.use(authMiddleware);


const port=5000;

let name="";
const cart=[];


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:true}));
app.use(express.static("public"));

//mongodb
connectMongoDB(process.env.MongoDB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


app.get("/",(req,res)=>{
    res.render("amazondupe",{ name });
});
app.get("/signin",(req,res)=>{
    res.render("signin",{ name,showLogin:false });

});
// app.post("/signin",(req,res)=>{
//    name=req.body.name;
//    let email=req.body.email;
//    let password=req.body.password;
//    console.log(email);
//    console.log(password);
//     console.log(name);

//     res.redirect("/");
   


// });
app.get("/returns",(req,res)=>{
    res.render("returns.ejs",{ name });
});
app.get("/official",(req,res)=>{
    res.redirect("https://www.amazon.in/");
});
//electronics

app.get("/electronics", (req, res) => {

    const electronics = [
        {
            name: "iphone",
            image: "iphone.webp",
            price: 70000
        },
        {
            name: "laptop",
            image: "laptop.webp",
             price: 75000
        },
        {
            name: "headphones",
            image: "headphones.webp",
             price: 90000
        },
        {
            name: "smartwatch",
            image: "smartwatch.webp",
             price: 2000
        },
        {
            name: "camera",
            image: "camera.webp",
             price: 50000
        },
        {
            name: "speaker",
            image: "speaker.webp",
             price: 70000
        },
        {
            name: "powerbank",
            image: "powerbank.webp",
             price: 1000
        },
        {
            name: "keyboard",
            image: "keyboard.webp",
             price: 20000
        }
    ];

    res.render("electronics", { electronics,name });
});

//cart
app.get("/cart", (req, res) => {
    res.render("cart", { cart,name});
});
app.post("/addtocart",(req,res)=>{
   const item = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price
    };
    cart.push(item);
    console.log(cart);
    res.redirect("/cart");

});

app.post("/removefromcart",(req,res)=>{
    const index=req.body.index;
    cart.splice(index,1);
    res.redirect("/cart");

});

//searchbar
app.get("/search",(req,res)=>{
    const query=req.query.query.toLowerCase();
    const electronics = [
        {
            name: "iphone",
            image: "iphone.webp",
            price: 70000
        },
        {
            name: "laptop",
            image: "laptop.webp",
             price: 75000
        },
        {
            name: "headphones",
            image: "headphones.webp",
             price: 90000
        },
        {
            name: "smartwatch",
            image: "smartwatch.webp",
             price: 2000
        },
        {
            name: "camera",
            image: "camera.webp",
             price: 50000
        },
        {
            name: "speaker",
            image: "speaker.webp",
             price: 70000
        },
        {
            name: "powerbank",
            image: "powerbank.webp",
             price: 1000
        },
        {
            name: "keyboard",
            image: "keyboard.webp",
             price: 20000
        }
    ];
    const filteredProducts=electronics.filter(item=>
        item.name.toLowerCase().includes(query)
    );
     res.render("electronics.ejs", {electronics: filteredProducts, name}
     
    );

});
app.use('/user',userrouter);
app.listen(port,()=>{
    console.log(`app is listning at ${port}`)
});
