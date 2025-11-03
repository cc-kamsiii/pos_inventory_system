import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import os from "os";

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


const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

const PORT = 8081;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  const ip = getLocalIP();
  console.log(`✅ Server running on http://${ip}:${PORT}`);
});


