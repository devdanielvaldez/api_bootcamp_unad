import http from 'http';
import express, { Express } from 'express';
import routes from './routes/index.routes';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://admin:admin@developcluster.k3bpf.mongodb.net/unad?retryWrites=true&w=majority', (err) => {
    if(err) return console.log(err, 'error al conectarme');

    console.log('Conectado a la base de datos MONGODB');
});

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api', routes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    return res.status(404).json({
        ok: false,
        message: error.message
    });
});

const httpServer = http.createServer(app);
const PORT:number = 3000;
httpServer.listen(PORT, () => console.log(`Mi servidor, esta corriendo en el puerto ${PORT}`));
