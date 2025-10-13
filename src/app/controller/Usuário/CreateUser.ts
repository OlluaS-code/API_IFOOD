import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { UserRepository } from "../../database/Usuário/UsuarioData";


export interface ICreateUser {
    id: number,
    name: string,
    telefone: string | undefined,
    endereco: string,
    email: string,
    password: string
}

export const NewUserValidation = validation((getSchema) => ({
    body: getSchema<ICreateUser>(yup.object().shape({
        id: yup.number().required().defined().moreThan(0),
        name: yup.string().required().defined().min(4),
        telefone: yup.string().optional().min(8),
        endereco: yup.string().required().defined().min(10),
        email: yup.string().email().required().defined().min(8),
    password: yup.string().required().defined().min(6),
    })),
}));


export const NewUser = (req: Request<{}, {}, ICreateUser> , res: Response) => {

    const newUserBody = req.body;
    const existingUser = UserRepository.findByEmail(newUserBody.email);

    if (existingUser){
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "O email fornecido já está em uso"});
    }

    const createUser = UserRepository.create(newUserBody);

    return res.status(StatusCodes.OK).json({
        message: `Usuário ${createUser.name} cadastrado com sucesso`,
        user: createUser
    });
};
