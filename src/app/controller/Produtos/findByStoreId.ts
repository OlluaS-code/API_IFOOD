import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { ProductRepository } from "../../database/Produtos/ProdutoData";

export interface IGetProductsParams {
    storeId?: number | undefined;
}

export const getByStoreIdValidation = validation((getSchema) => ({
    params: getSchema<IGetProductsParams>(yup.object().shape({
        storeId: yup.number().integer().optional().moreThan(0)
    }))
}));

export const productByStoreId = async (req: Request<IGetProductsParams>, res: Response) => {
    const store_ID = Number(req.params.storeId);

    const products = await ProductRepository.findByStoreId(store_ID);

    return !products || products.length === 0
        ? res.status(StatusCodes.NOT_FOUND).json({
            error: `Nenhum produto encontrado para a Loja ID ${store_ID}.`
        })
        : res.status(StatusCodes.OK).json(products);
};
