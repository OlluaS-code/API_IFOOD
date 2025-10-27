import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { ProductRepository } from "../../database/Produtos/ProdutoData";
import { validation } from "../../shared/middlewares";

export interface IUpdateProductParams {
    store_ID?: number;
    product_ID?: number;
}

export interface IUpdateProductBody {
    name: string | undefined;
    price: number | undefined;
    stock: number | undefined;
}

export const UpdateItemValidation = validation((getSchema) => ({
    params: getSchema<IUpdateProductParams>(yup.object().shape({
        store_ID: yup.number().required().moreThan(0),
        product_ID: yup.number().required().moreThan(0),
    })),
    body: getSchema<IUpdateProductBody>(yup.object().shape({
        name: yup.string().min(3).optional(),
        price: yup.number().moreThan(0).optional(),
        stock: yup.number().min(0).optional(),
    })),
}));

export const updateProducts = async (req: Request<IUpdateProductParams, {}, IUpdateProductBody>, res: Response) => {

    const product_ID = Number(req.params.product_ID);
    const store_ID = Number(req.params.store_ID);
    const userData = req.body;

    const WasUpdate = await ProductRepository.updatePartial(product_ID, store_ID, userData);

    return WasUpdate > 0
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto ID ${product_ID} não encontrado na Loja ID ${store_ID}, ou acesso negado.`
        });
};
