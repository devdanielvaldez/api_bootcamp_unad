import { model, Schema, Model, Document } from 'mongoose';

const MateriasSchema: Schema = new Schema({
    codigoMateria: { type: String, required: true, maxlength: 4, minlength: 4 }, 
    nombre: { type: String, required: true, maxlength: 60, minlength: 2 },
    creditos: { type: Number, required: true, min: 1, max: 8 }
},
{ timestamps: true }
);

const Materias: Model<any> = model('Materias', MateriasSchema);

export default Materias;