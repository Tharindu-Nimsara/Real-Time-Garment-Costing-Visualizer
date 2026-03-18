import express, { json } from 'express';
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(json());

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});