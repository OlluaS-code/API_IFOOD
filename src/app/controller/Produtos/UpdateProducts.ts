import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { ProductRepository } from "../../database/Produtos/ProdutoData";

export interface IUpdateProductsParams {
    id?: number;
}

export interface IUpdateProductBody {
    name: string | undefined;
    price: number | undefined;
    stock: number | undefined;
}

export const removeItemValidation = validation((getSchema) => ({
    params: getSchema<IUpdateProductsParams>(yup.object().shape({
        id: yup.number().required().defined().moreThan(0),
    })),
    body: getSchema<IUpdateProductBody>(yup.object().shape({
        name: yup.string().min(3).optional(),
        price: yup.number().moreThan(0).optional(),
        stock: yup.number().min(0).optional(),
    })),
}));

export const updateProducts = (req: Request<IUpdateProductsParams, {}, IUpdateProductBody>, res: Response) => {
    const id = Number(req.params.id);
    const productData = req.body;

    const WasUpdate = ProductRepository.update(id, productData);

    return WasUpdate
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${id} não encontrado.`
        });
};
