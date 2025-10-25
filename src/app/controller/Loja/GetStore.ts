import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StoreRepository } from '../../database/Loja/LojaData';

export const getAll = async (req: Request, res: Response) => {

    const storesList = await StoreRepository.getAll();

    return res.status(StatusCodes.OK).json(storesList);
};
