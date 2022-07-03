import { model, Schema, Model, Document } from 'mongoose';

const MateriasSchema: Schema = new Schema({
    codigoMateria: { type: String, required: true, maxlength: 4, minlength: 4 }, 
    nombre: { type: String, required: true, maxlength: 60, minlength: 2 },
    creditos: { type: Number, required: true, min: 1, max: 8 }
},
{ timestamps: true }
);

const Materias: Model<any> = model('Materias', MateriasSchema);

export enum STATUS_MATERIAS {
    COMPLETE = 'COMPLETE',
    INCOMPLETE = 'INCOMPLETE',
    IN_PROGRESS = 'IN_PROGRESS'
}

const RecordDeNotasSchema: Schema = new Schema({
    materia: { type: Schema.Types.ObjectId, ref: 'Materias' },
    status: { type: String, enum: STATUS_MATERIAS },
},
{ timestamps: true }
);

const RecordDeNotas: Model<any> = model('RecordDeNotas', RecordDeNotasSchema);

export {
    Materias,
    RecordDeNotas
};