const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { getAllUsers, updateUserStatus } = require("./userManagement.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5100;

app.use(cors());
app.use(express.json());


// Admin routes integrated into the main server
app.get("/api/admin/users", getAllUsers);
app.patch("/api/admin/users/:id", updateUserStatus);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Auth Service DB connected");
        app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
    })
    .catch((err) => console.log(err));
