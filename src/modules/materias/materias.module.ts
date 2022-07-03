import { Request, Response } from "express";
import MateriasSchema from "./materias.schemas";
import UsersSchema from "../auth/users.schemas";

interface IMaterias {
  codigo: string;
  nombre: string;
  creditos: number;
}

const registerMaterias = async (req: Request, res: Response) => {
  try {
    const body: IMaterias = req.body;
    const { codigo, nombre, creditos } = body;

    MateriasSchema.findOne({ codigoMateria: codigo }).exec((err: any, doc: any) => {
      if (err)
        return res.status(400).json({
          ok: false,
          message: "Error inesperado, contacto al administrador del sistema",
        });

      console.log(doc)  
      if (doc !== null)
        return res.status(400).json({
          ok: false,
          message: "La materia ya existe",
        });

      const saveMateria = new MateriasSchema({
        codigoMateria: codigo,
        nombre: nombre,
        creditos: +creditos,
      });

      saveMateria.save((err: any, doc: any) => {
        if (err)
          return res.status(400).json({
            ok: false,
            message: "Error al guardar la materia",
            error: err,
          });

        res.status(201).json({
          ok: true,
          message: "Materia guardada correctamente",
          data: doc,
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "Error inesperado, contacto al administrador del sistema",
    });
  }
};

const addMaterias = async (req: Request, res: Response) => {
  try {
    const { studentId, materiaId } = req.params;
    UsersSchema.findById(studentId)
      .select("-password")
      .exec((err: any, doc: any) => {
        if (err)
          return res.status(400).json({
            ok: false,
            message: "Error inesperado, contacto al administrador del sistema",
          });

        if (doc === null)
          return res.status(400).json({
            ok: false,
            message: "El estudiante no existe",
          });

        MateriasSchema.findById(materiaId).exec((err: any, doc: any) => {
          if (err)
            return res.status(400).json({
              ok: false,
              message:
                "Error inesperado, contacto al administrador del sistema",
            });

          if (doc === null)
            return res.status(400).json({
              ok: false,
              message: "La materia no existe no existe",
            });

          UsersSchema.findByIdAndUpdate(
            studentId,
            { $push: { materias: materiaId } },
            { new: true }
          ).exec((err: any, doc: any) => {
            if (err)
              return res.status(400).json({
                ok: false,
                message:
                  "Error inesperado, contacto al administrador del sistema",
              });

            res.status(200).json({
              ok: true,
              message: "Materia agregada correctamente",
              data: doc,
            });
          });
        });
      });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "Error inesperado, contacto al administrador del sistema",
    });
  }
};

const getMateriasByStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        UsersSchema.findById(studentId)
        .populate("materias")
        .exec((err: any, doc: any) => {
            if(err) return res.status(400).json({
                ok: false,
                message: "Error inesperado, contacto al administrador del sistema",
            });

            if(doc === null) return res.status(404).json({
                ok: false,
                message: "El estudiante no existe",
            });

            res.status(200).json({
                ok: true,
                data: doc.materias
            })
        })
    } catch(err) {
        res.status(500).json({
            ok: false,
            message: "Error inesperado, contacto al administrador del sistema",
        });
    }
}

const getAll = async(req: Request, res: Response) => {
  try {
    let query = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    let perPage = +query.limit,
        page = Math.max(0, (+query.page - 1));

    await MateriasSchema.find()
    .skip(perPage * page)
    .limit(perPage)
    .sort({
      nombre: 'desc'
    })
    .exec((err: any, doc: any) => {
      MateriasSchema
      .count()
      .exec((err: any, count: any) => {
        res.status(200).json({
          ok: true,
          data: doc,
          pagination: {
            page: +query.page,
            limit: +query.limit,
            total: count,
            pages: Math.round(count / perPage)
          }
        })
      })
    })
  } catch(err) {
    return res.status(500).json({
      ok: false,
      message: "Error inesperado, contacto al administrador del sistema",
      error: err
    });
  }
}

export { registerMaterias, addMaterias, getMateriasByStudent, getAll };
