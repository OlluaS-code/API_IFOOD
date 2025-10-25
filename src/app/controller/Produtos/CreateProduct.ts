import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { ProductRepository } from "../../database/Produtos/ProdutoData";

export interface ICreateProduct {
    storeId: number,
    name: string,
    price: number,
    stock: number
}

export const createProductValidator = validation((getSchema) => ({
    body: getSchema<ICreateProduct>(yup.object().shape({
        storeId: yup.number().required().defined().moreThan(0),
        name: yup.string().required().defined().min(3),
        price: yup.number().required().integer().moreThan(0),
        stock: yup.number().required().integer().moreThan(0)
    })),
}));


export const createProduct = async (req: Request<{}, {}, ICreateProduct>, res: Response) => {
    const productData = req.body;

    const newProduct = await ProductRepository.create(productData);

    return res.status(StatusCodes.CREATED).json({
        message: "Produto cadatrado com sucesso.",
        product: newProduct
    });
};
