const { Schema, model } = require("mongoose");

//Schema for the user
const useSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    address: String,
    phone: String,
    title: String,
    maritalStatus: String,
    birthDate: String,
    profession: String,
    photo: String,
    biography: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model('user', useSchema);