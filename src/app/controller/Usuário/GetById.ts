import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../database/Usuário/UsuarioData';


export const FindById = async (req: Request, res: Response) => {

    const { id } = req.params;
    const userId = Number(id);

    const user = UserRepository.findById(userId);

    return !user
        ? res.status(StatusCodes.NOT_FOUND).json({ error: `Usuário com ID ${userId} não encontrado.` })
        : res.status(StatusCodes.OK).json(user);
};
