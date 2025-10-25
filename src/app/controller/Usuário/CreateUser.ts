import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { UserRepository } from "../../database/Usuário/UsuarioData";


export interface ICreateUser {
    usuario_ID: number | undefined,
    name: string,
    phone: string | undefined,
    adress: string,
    email: string,
    password: string
}

export const NewUserValidation = validation((getSchema) => ({
    body: getSchema<ICreateUser>(yup.object().shape({
        usuario_ID: yup.number().optional().moreThan(0),
        name: yup.string().required().defined().min(4),
        phone: yup.string().optional().min(8),
        adress: yup.string().required().defined().min(10),
        email: yup.string().email().required().defined().min(8),
        password: yup.string().required().defined().min(6),
    })),
}));

export const NewUser = async (req: Request<{}, {}, ICreateUser> , res: Response) => {

    const newUserBody = req.body;
    const existingUser = await UserRepository.findByEmail(newUserBody.email);

    if (existingUser){
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "O email fornecido já está em uso"});
    }

    const newUserId = await UserRepository.create(newUserBody);

    return res.status(StatusCodes.OK).json({
        message: `Usuário ${newUserBody.name} cadastrado com sucesso`,
        user: {
            usuario_ID: newUserId,
            name: newUserBody.name
        }
    });
};
