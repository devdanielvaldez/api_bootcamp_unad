import { Request, Response } from 'express';
import User from './users.schemas';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = 'ADSFADS7F98QHWEFBO(&%*&YHOU&ˆFVOUV&ˆ$%#';

interface IUnadRegister {
    name: string;
    lastName: string;
    matricula: string;
    email: string;
    password: string;
}

interface ILogin {
    userName: string;
    password: string;
}

const register = async(req: Request, res: Response) => {
    const body:IUnadRegister = req.body;
    User.findOne({ matricula: body.matricula })
    .exec((err: any, doc: any) => {
        if(err) return res.status(400).json({
            ok: false,
            message: "Error inesperado, contacto al administrador del sistema"
        });

        if(doc !== null) return res.status(400).json({
            ok: false, 
            message: "El usuario ya existe"
        });

        const pass = bcrypt.hashSync(body.password, 10);

        const saveUser = new User({
            name: body.name,
            lastName: body.lastName,
            matricula: body.matricula,
            email: body.email,
            password: pass
        });
    
        saveUser.save((err:any, doc:any) => {
            if(err) return res.status(400).json({
                ok: false,
                message: "Error al guardar el usuario",
                error: err
            });
    
            res.status(201).json({
                ok: true,
                message: "Usuario guardado correctamente",
            });
        });


    })
}

const login = async(req: Request, res: Response) => {
    try {
        const body:ILogin = req.body;
        const { userName, password } = body;
        User.findOne({ matricula: userName })
        .exec((err: any, doc: any) => {
            if(err) return res.status(400).json({
                ok: false,
                message: "Error inesperado, contacto al administrador del sistema"
            });

            if(doc == null) return res.status(400).json({
                ok: false,
                message: "El usuario o contraseña son incorrectos"
            });



            const pass = bcrypt.compare(password, doc.password);

            if(!pass) return res.status(400).json({
                ok: false,
                message: "El usuario o contraseña son incorrectos"
            });

            let token = jwt.sign({
                id: doc._id,
                matricula: doc.matricula,
            }, TOKEN_SECRET, { expiresIn: '30d'});

            res.status(200).json({
                ok: true,
                message: "Usuario autenticado correctamente",
                accessToken: token
            });
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            message: "Error inesperado",
            error: err
        });
    }
}

export {
    register,
    login
}