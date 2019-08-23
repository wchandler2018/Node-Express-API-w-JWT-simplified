const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const usersRoute = require("./routes/users");

const app = express();

//routes import
const authRoutes = require("./routes/auth");

//body-parser middleware
app.use(express.json());

//routes middleware
app.use("/api/user", authRoutes);
app.use("/api/users", usersRoute);

//mongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => {
  console.log("db connected");
});

//server connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
