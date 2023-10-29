const { Schema, model } = require("mongoose");

const patientSchema = new Schema(
  {
    photo: String,
    name: String,
    age: String,
    date: String,
    gender: String,
    history: [String],
    allergies:[String]
  },{
    timestamps: true,
  });

  module.exports = model('patient', patientSchema);
