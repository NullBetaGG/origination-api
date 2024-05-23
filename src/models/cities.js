const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  state_id: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  ibge_code: { type: Number, required: true },
  cod_tom: { type: Number, required: true }
});

const City = mongoose.model("City", citySchema);

module.exports = City;