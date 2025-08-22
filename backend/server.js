const express = require('express');
const connectDB = require('./db');
const todoRoutes = require('./routes/todoRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(require('cors')());

app.use('/api/todos', todoRoutes);

app.get('/api', (req, res) => {
const { data } = req.query;
if (!data) return res.json([{ data: null, status: 'no data' }]);
res.json([{ data, status: 'success' }]);
});

app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({ message: err.message });
});

connectDB().then(() => {
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});