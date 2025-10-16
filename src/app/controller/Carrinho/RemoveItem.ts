import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { CartRepository } from "../../database/Carrinho/CarrinhoData";


export interface IRemoveItemBody {
    id?: number;
}

export const removeItemValidation = validation((getSchema) => ({
    params: getSchema<IRemoveItemBody>(yup.object().shape({
        id: yup.number().required().defined().moreThan(0),
    })),
}));

export const removeItem = async (req: Request<IRemoveItemBody, {}, {}>, res: Response) => {

    const id = Number(req.params.id);

    const wasRemoved = CartRepository.removeItemById(id);

    return wasRemoved
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${id} não encontrado no carrinho.`
        });
};
