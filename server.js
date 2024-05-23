const cors = require("cors");
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { default: mongoose } = require('mongoose');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 8080;

const ordersConnection = mongoose.createConnection(process.env.MONGO_URI_ORDERS);
const Order = ordersConnection.model('Order', require('./src/models/orders').schema);

const citiesConnection = mongoose.createConnection(process.env.MONGO_URI_CITIES);
const City = citiesConnection.model('City', require('./src/models/cities').schema);

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/new-orders', async (req, res) => {
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

app.get('/cities', async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/cities/search', async (req, res) => {
  const { name } = req.query;
  try {
    const cities = await City.find({ name: { $regex: name, $options: 'i' } });
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});