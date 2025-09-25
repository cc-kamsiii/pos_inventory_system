import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.js";
import inventoryRoutes from "./routes/inventory.js";
import menuRoutes from "./routes/menu.js";  
import staffTransactionsRoutes from "./routes/staffTransactions.js"
import ownerTransactionRoutes from "./routes/ownerTransactions.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/menu", menuRoutes);

app.use("/staffTransactions", staffTransactionsRoutes);
app.use("/ownerTransactions", ownerTransactionRoutes);

app.listen(8081, () => {
    console.log("Server running on port 8081");
});
