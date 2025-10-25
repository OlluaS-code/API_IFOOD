import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { IStoreParams } from "./PostProducts";
import { StoreRepository } from "../../database/Loja/LojaData";


export const StoreByIdValidation = validation((getSchema) => ({
    params: getSchema<IStoreParams>(yup.object().shape({
        store_ID: yup.number().integer().required().moreThan(0)
    }))
}));

export const StoreById = async (req: Request<IStoreParams>, res: Response) => {
    const id = Number(req.params.store_ID);

    const store = await StoreRepository.findById(id);

    return store
        ? res.status(StatusCodes.OK).json(store)
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${id} não encontrado.`
        });
};
