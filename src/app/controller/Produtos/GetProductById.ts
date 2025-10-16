import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { ProductRepository } from "../../database/Produtos/ProdutoData";

export interface IGetProductsParams {
    id: number | undefined
}

export const getProductByIdValidation = validation((getSchema) => ({
    params: getSchema<IGetProductsParams>(yup.object().shape({
        id: yup.number().integer().optional().moreThan(0)
    }))
}));

export const productById = (req: Request<IGetProductsParams>, res: Response) => {
    const id = Number(req.params.id);

    const product = ProductRepository.findByID(id);

    return product
        ? res.status(StatusCodes.OK).json(product)
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${id} não encontrado.`
        });
};
