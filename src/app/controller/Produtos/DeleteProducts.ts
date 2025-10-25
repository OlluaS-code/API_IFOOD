import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares/Validation";
import { ProductRepository } from "../../database/Produtos/ProdutoData";

export interface IDeleteProductParams {
   storeId?: number;
    id?: number;
}

export const deleteProductsValidation = validation((getSchema) => ({
    params: getSchema<IDeleteProductParams>(yup.object().shape({
            storeId: yup.number().required().defined().moreThan(0),
            id: yup.number().required().defined().moreThan(0),
        })),
}));

export const deleteProducts = async (req: Request<IDeleteProductParams>, res: Response) => {

    const store_ID = Number(req.params.storeId);
    const id = Number(req.params.id);


    const wasDeleted = await ProductRepository.delete(id, store_ID);

    return wasDeleted
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${id} não encontrado.`
        });
};
