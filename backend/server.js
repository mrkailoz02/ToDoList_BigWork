require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  const { data } = req.query;
  if (!data) return res.json([{ data: null, status: "no data" }]);
  res.json([{ data, status: "success" }]);
});

app.use("/api/todos", todoRoutes);

app.get('/api/data', (req, res) => {
    const dataQuery = req.query.data;

    if (dataQuery) {
        res.json([{ data: dataQuery, status: 'success' }]);
    } else {
        res.json([{ data: null, status: 'no data' }]);
    }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
