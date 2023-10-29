const { Router } = require("express");
const route = Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");


route.get("/", (req, res) => res.send("Bienvenido")); //prueba servidor

//metodos para los pacientes
const message = "Usuario registrado ";

route.post("/add-patient", async (req, res) => {
  const { photo, name, age, date, gender, history, allergies } = req.body;
  const newPatient = new Patient({
    photo,
    name,
    age,
    date,
    gender,
    history,
    allergies,
  });
  await newPatient.save();

  const token = jwt.sign({ _id: newPatient._id }, "ClaveSecreta");
  res.status(200).json({ message: "new patient registred succesfully", token });
});

//list patients
route.get('/list-patient', async (req, res) => {
  try {
    const patients = await Patient.find(); // Consulta todos los pacientes

    res.json(patients);
  } catch (err) {
    console.error('Error al obtener la lista de pacientes', err);
    res.status(500).json({ error: 'Error al obtener la lista de pacientes' });
  }
});

//pathient by id pra mostrar el pefil del paciente
route.get('/patient/:id', async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await Patient.findById(patientId); // Suponiendo que utilizas Mongoose

    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error al obtener la información del paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//endpoing para actualizar a un paciente
route.put('/update-patient/:id', async (req, res) => {
  const patientId = req.params.id; // Obtén el ID del paciente de los parámetros de la URL
  const updates = req.body; // Obtén los datos de actualización del cuerpo de la solicitud

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(patientId, updates, { new: true });

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete patient

route.delete('/delete-patient/:id', async (req, res) => {
  const patientId = req.params.id;

  try {
    // Busca al paciente por ID y elimínalo
    const deletedPatient = await Patient.findByIdAndRemove(patientId);

    if (deletedPatient) {
      res.json({ message: 'Paciente eliminado con éxito' });
    } else {
      res.status(404).json({ message: 'Paciente no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar al paciente', error: err });
  }
});

//metodos para los usuarios
//method for register
route.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new user({ name, email, password });
  await newUser.save();
  const token = jwt.sign({ _id: newUser._id }, "ClaveSecreta");
  res.status(200).json({ token });
});

route.put("/complete-profile", verifyToken, async (req, res) => {
  const { biography, title, phone, address, photo, birthDate } = req.body;
  const userId = req.userId;
  try {
    const userToUpdate = await user.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    userToUpdate.biography = biography;
    userToUpdate.title = title;
    userToUpdate.phone = phone;
    userToUpdate.address = address;
    userToUpdate.photo = photo;
    userToUpdate.birthDate = birthDate;

    await userToUpdate.save();

    const token = jwt.sign({ _id: userId }, "ClaveSecreta");

    return res.status(200).json({
      message: "Profile updated successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const User = await user.findOne({ email });
  if (!User) return res.status(401).send("El correo o contrasenia no existen");
  if (User.password !== password)
    return res.status(401).send("La contrasenia o el correo no existen");
  const token = jwt.sign({ _id: User._id }, "ClaveSecreta");
  return res.status(200).json({ token });
});

module.exports = route;

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).rend("Acceso autorizado");
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token === null) {
    return res.status(401).send("Acceso No autorizado");
  }
  const payload = jwt.verify(token, "ClaveSecreta");
  req.userId = payload._id;
  next();
}
