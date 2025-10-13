import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares/Validation";
import { ProductRepository } from "../../database/Produtos/ProdutoData";

export interface IDeleteProductParams {
    id?: number;
}

export const deleteProductsValidation = validation((getSchema) => ({
    params: getSchema<IDeleteProductParams>(yup.object().shape({
        id: yup.number().integer().required().defined().moreThan(0),
    })),
}));

export const deleteProducts = (req: Request<IDeleteProductParams>, res: Response) => {


    const id = Number(req.params.id);


    const wasDeleted = ProductRepository.delete(id);

    return wasDeleted
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${id} não encontrado.`
        });
};
