import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StoreRepository } from "../../database/Loja/LojaData";

export interface IUpdateStoreParams {
    store_ID?: number;
}

export interface IUpdateStoreBody {
    name: string | undefined;
    category: string | undefined;
    address: string | undefined;
    phone: string | undefined;
}

export const UpdateStoreValidation = validation((getSchema) => ({
    params: getSchema<IUpdateStoreParams>(yup.object().shape({
        store_ID: yup.number().required().defined().moreThan(0),
    })),
    body: getSchema<IUpdateStoreBody>(yup.object().shape({
        name: yup.string().optional().min(3),
        category: yup.string().optional().min(3),
        address: yup.string().optional().min(5),
        phone: yup.string().optional().min(8),
    })),
}));

export const UpdateStore = async (req: Request<IUpdateStoreParams, {}, IUpdateStoreBody>, res: Response) => {
    const id = Number(req.params.store_ID);
    const productData = req.body;

    const WasUpdate = await StoreRepository.updatePartial(id, productData);

    return WasUpdate
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${id} não encontrado.`
        });
};
