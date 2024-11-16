const express = require("express");
const path = require("node:path");
const userRouter = require("./routes/userRoutes")
const session = require('express-session');

const app = express();
const methodOverride = require('method-override');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
    session({
        secret: 'your-secret-key', 
        resave: false,          
        saveUninitialized: false,
        cookie: { secure: false } 
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use("/", userRouter);


app.listen(3000, () => console.log("app listening on port 3000!"));