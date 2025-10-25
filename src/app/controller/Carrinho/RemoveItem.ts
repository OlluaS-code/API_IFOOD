import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { CartRepository } from "../../database/Carrinho/CarrinhoData";

export interface IRemoveItemParams {
    usuario_ID?: number;
    item_ID?: number;
}

export const removeItemByIdValidation = validation((getSchema) => ({
    params: getSchema<IRemoveItemParams>(yup.object().shape({
        usuario_ID: yup.number().required().defined().moreThan(0),
        item_ID: yup.number().integer().required().moreThan(0),
    })),
}));

export const removeItemById = async (req: Request<IRemoveItemParams, {}, {}>, res: Response) => {

    const usuario_ID = Number(req.params.usuario_ID);
    const item_ID = Number(req.params.item_ID);

    const wasDeleted = await CartRepository.removeItemById(item_ID, usuario_ID);

    if (wasDeleted) {
        return res.status(StatusCodes.NO_CONTENT).send();
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: `Item ID ${item_ID} não encontrado no carrinho do Usuário ID ${usuario_ID}, ou acesso negado.`
        });
    }
};
