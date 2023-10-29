const express =require('express')
const app = express();
require('./database');
const cors = require('cors');
const bodyParser = require('body-parser');


//convertir datos que recibe el servidor en json

app.use(cors());
app.use(express.json());
app.use(require('./routes/userRoutes'));



app.listen(4000);
console.log("Server on port", 4000);
