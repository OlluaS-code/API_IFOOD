import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../../database/Usuário/UsuarioData';



export const GetAll = async (req: Request, res: Response) => {

    const usersList = await UserRepository.getAll();

    return res.status(StatusCodes.OK).json(usersList);
};
