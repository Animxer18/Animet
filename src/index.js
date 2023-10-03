const express = require("express");
const layouts = require("express-ejs-layouts");
const router = require("./routes/router");
const path = require("path");
// App Init
const app = express();
// Middlewares & Template
app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);
app.use(router);
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("layout", path.join(__dirname, "layouts", "layout"));
app.set("view engine", "ejs");
// App Listening
app.listen(1001, () => console.log("Animet is Running!"));
