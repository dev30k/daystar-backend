import express from 'express';
import bodyParser from 'body-parser';
import graduants from './routes/graduants.js'


import cors from 'cors';

const CORS = cors();
const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: false }));

app.use(CORS);
app.use(bodyParser.json());



app.use('/daystar_grad_sys/api/v1/', graduants);


app.get('/', (req, res) => res.send('Congratulations you have reached the Daystar_grad_sys API!!!')
);

app.listen(PORT, () => console.log(`listening on Port 'http://localhost:${PORT}`));