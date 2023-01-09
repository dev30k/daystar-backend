const express = require('express');
const bodyParser = require('body-parser');
const {router} = require("./src/routes/daystar") ;
const cors = require('cors');
const dotenv =  require('dotenv');


const CORS = cors();
const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));

app.use(CORS);
app.use(bodyParser.json());



app.use('/daystar_grad_sys/api/v1/', router);


app.get('/', (req, res) => res.send('Congratulations you have reached the Daystar_grad_sys API!!!')
);

app.listen(PORT, () => console.log(`listening on Port 'http://localhost:${PORT}`));