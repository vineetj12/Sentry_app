import express from "express";
import authRouter from "./routes/auth.js";
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
// Routes
app.use("/auth", authRouter);
// Health check
app.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map