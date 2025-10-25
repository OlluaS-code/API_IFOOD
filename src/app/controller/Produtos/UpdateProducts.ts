import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { ProductRepository } from "../../database/Produtos/ProdutoData";
import { validation } from "../../shared/middlewares";

export interface IUpdateProductParams {
    storeId?: number;
    id?: number;
}

export interface IUpdateProductBody {
    name: string | undefined;
    price: number | undefined;
    stock: number | undefined;
}

export const UpdateItemValidation = validation((getSchema) => ({
    params: getSchema<IUpdateProductParams>(yup.object().shape({
        storeId: yup.number().required().defined().moreThan(0),
        id: yup.number().required().defined().moreThan(0),
    })),
    body: getSchema<IUpdateProductBody>(yup.object().shape({
        name: yup.string().min(3).optional(),
        price: yup.number().moreThan(0).optional(),
        stock: yup.number().min(0).optional(),
    })),
}));

export const updateProducts = async (req: Request<IUpdateProductParams, {}, IUpdateProductBody>, res: Response) => {

    const product_ID = Number(req.params.id);
    const store_ID_Auth = Number(req.params.storeId);

    const userData = req.body;

    const WasUpdate = await ProductRepository.updatePartial(
        product_ID,
        store_ID_Auth,
        userData
    );

    return WasUpdate > 0
        ? res.status(StatusCodes.NO_CONTENT).send()
        : res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto ID ${product_ID} não encontrado na Loja ID ${store_ID_Auth}, ou acesso negado.`
        });
};
