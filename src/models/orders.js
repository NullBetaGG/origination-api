const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  volume: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  product: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  date: { type: Date, required: true },
  supplier: { type: String, required: false },
  type: { type: String, required: true },
  ibge_code: { type: Number, required: true },
  new_price: { type: String, required: false },
  boarding_limit: { type: String, required: false }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;