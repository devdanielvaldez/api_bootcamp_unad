import { model, Schema, Model, Document } from 'mongoose';

interface IUsers extends Document {
    name: string;
    lastName: string;
    matricula: string;
    email?: string;
    password: string;
}

const UsersSchema: Schema = new Schema({
    name: { type: String, required: true, maxlength: 60, minlength: 2 },
    lastName: { type: String, required: true, maxlength: 60, minlength: 2 },
    matricula: { type: String, required: true, maxlength: 8, minlength: 8 },
    email: { type: String },
    password: { type: String, required: true },
    materias: [{ type: Schema.Types.ObjectId, ref: 'Materias' }],
    recordDeNotas: [{
        type: Schema.Types.ObjectId,
        ref: 'RecordDeNotas'
    }]
},

{ timestamps: true }
);

const User: Model<any> = model('Users', UsersSchema);

export default User;