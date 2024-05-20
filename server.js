const cors = require("cors");
const express = require('express');
const Order = require('./src/models/orders');
const swaggerUi = require('swagger-ui-express');
const { default: mongoose } = require('mongoose');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {

      console.error("Error connecting to the database", err);
    });
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/newOrders', async (req, res) => {
  const currentDate = new Date().toISOString();
  req.body.date = currentDate;

  const order = new Order(req.body);
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
