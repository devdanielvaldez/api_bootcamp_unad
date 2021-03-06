import * as express from 'express';
import { register, login } from '../modules/auth/auth.modules';
import { registerMaterias, addMaterias,getMateriasByStudent, getAll, getNotasByStudent, updateStatus } from '../modules/materias/materias.module';
const routes:express.Router = express.Router();

routes.post('/register', register);
routes.post('/login', login);
routes.post('/mat/register', registerMaterias);
routes.put('/mat/:studentId/:materiaId', addMaterias);
routes.get('/mat/:studentId', getMateriasByStudent);
routes.get('/mat', getAll);
routes.get('/mat/notas/:studentId', getNotasByStudent);
routes.put('/mat/status/:recordId', updateStatus);

export default routes;