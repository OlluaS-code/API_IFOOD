import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares/Validation';
import { ProductRepository } from '../../database/Produtos/ProdutoData';
import { StoreRepository } from '../../database/Loja/LojaData';

export interface IStoreParams {
    storeId?: number;
}

export interface IPostProductsBody {
    name: string;
    price: number;
    stock: number;
}

export const postProductsValidation = validation((getSchema) => ({
    params: getSchema<IStoreParams>(yup.object().shape({
        storeId: yup.number().integer().required().defined().moreThan(0),
    })),
    body: getSchema<IPostProductsBody>(yup.object().shape({
        name: yup.string().required().min(3),
        price: yup.number().required().moreThan(0),
        stock: yup.number().required().integer().min(0),
    })),
}));

export const postProducts = async (req: Request<IStoreParams, {}, IPostProductsBody>, res: Response) => {

    const storeId = Number(req.params.storeId);
    const productData = req.body;

    const storeExists = StoreRepository.findByID(storeId);

    if (!storeExists) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: `Loja com ID ${storeId} não encontrada.`
        });
    }

    const newProduct = ProductRepository.create({
        ...productData,
        storeId: storeId
    });

    return res.status(StatusCodes.CREATED).json({
        message: `Produto cadastrado com sucesso na Loja ID ${storeId}.`,
        product: newProduct
    });
};
