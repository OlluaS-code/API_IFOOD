import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from "yup";
import { UserRepository } from '../../database/Usuário/UsuarioData';
import { validation } from '../../shared/middlewares';

export interface IUserParams {
    id?: number
}

export const FindByIdValidation = validation((getSchema) =>({
    params: getSchema<IUserParams>(yup.object().shape({
            id: yup.number().required().defined().moreThan(0),
        }))
}));


export const FindById = async (req: Request<IUserParams>, res: Response) => {

    const usuario_ID = Number(req.params.id);

    const user = await UserRepository.findById(usuario_ID);

    return !user
        ? res.status(StatusCodes.NOT_FOUND).json({ error: `Usuário com ID ${usuario_ID} não encontrado.` })
        : res.status(StatusCodes.OK).json(user);
};
