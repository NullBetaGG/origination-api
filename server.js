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

//TODO: Refazer uma API apenas para dados de cidades e estados brasileiros
//Conexão em dois bancos diferentes, de Cidades e de Ordens
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
  const { user, volume, unit, price, product, city, state, type, ibge_code, supplier, boarding_limit } = req.body;

  const errors = [];
  if (!user) errors.push("Insira o nome do usuário");
  if (volume === undefined) errors.push("Insira o volume");
  if (!unit) errors.push("Escolha a unidade");
  if (price === undefined) errors.push("Insira o preço");
  if (!product) errors.push("Insira o produto");
  if (!city) errors.push("Selecione uma cidade");
  if (!state) errors.push("State is required");
  if (!type) errors.push("Escolha um tipo");
  if (!boarding_limit) errors.push("Escolha limite de embarque");
  if (ibge_code === undefined) errors.push("IBGE code is required");

  if (type === 'oferta' && !supplier) errors.push("É necessário adicionar um fornecedor caso seja uma Oferta");

  if (errors.length > 0) {
    return res.status(400).json({ message: errors });
  }

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