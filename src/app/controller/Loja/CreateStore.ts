import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares/Validation';
import { StoreRepository } from '../../database/Loja/LojaData';


export interface ICreateStoreBody {
  name: string;
  category: string;
  address: string;
  phone: string;
}

export const createStoreValidation = validation((getSchema) => ({
  body: getSchema<ICreateStoreBody>(yup.object().shape({
    name: yup.string().required().min(3),
    category: yup.string().required().min(3),
    address: yup.string().required().min(5),
    phone: yup.string().required().min(8),
  })),
}));

export const create = async (req: Request<{}, {}, ICreateStoreBody>, res: Response) => {

    const storeData = req.body;

    const newStore = await StoreRepository.create(storeData);

    return res.status(StatusCodes.CREATED).json({
        message: 'Loja cadastrada com sucesso.',
        store: newStore
    });
};
