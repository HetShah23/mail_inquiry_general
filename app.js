// import libraries
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");

const app = express();

app.use(cors());

// increase file upload size
app.use(bodyParser.json({ limit: "50mb", extended: false }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(compression());

// import all the routes in this file
const mainRouter = require("./routes/main.route");

// all the routes
app.use("/", mainRouter);

// listen on port 3002
const server = http.createServer(app);
server.listen(3002);

// middleware error handler
const errorHandler = require("./helper/error");
app.use(errorHandler);