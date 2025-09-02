const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/auth", authRoutes);

app.listen(8081, () => {
    console.log("Server running on port 8081");
});
