import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares/Validation';
import { ProductRepository } from '../../database/Produtos/ProdutoData';
import { CartRepository } from '../../database/Carrinho/CarrinhoData';

export interface ICartParams {
    usuario_ID?: number
    storeId?: number
}

export interface IAddToCartBody {
    productId: number;
    quantity: number;
}

export const addToCartValidation = validation((getSchema) => ({
    params: getSchema<ICartParams>(yup.object().shape({
            usuario_ID: yup.number().required().defined().moreThan(0),
            storeId: yup.number().integer().required().moreThan(0)
        })),
    body: getSchema<IAddToCartBody>(yup.object().shape({
        productId: yup.number().required().defined().moreThan(0),
        quantity: yup.number().required().defined().moreThan(0).integer(),
    })),
}));


export const addToCart = async (req: Request<ICartParams, {}, IAddToCartBody>, res: Response) => {

    const usuario_ID = Number(req.params.usuario_ID);
    const store_ID = Number(req.params.storeId);
    const { productId, quantity } = req.body;

    const product = await ProductRepository.findById(store_ID, productId);

    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: `Produto com ID ${productId} não encontrado no catálogo.`
        });
    }

    if (product.stock < quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: `Estoque insuficiente. Disponível: ${product.stock} unidade(s).`
        });
    }

    const postItem = await CartRepository.addItem(product.produto_ID, usuario_ID, quantity);

    return res.status(StatusCodes.CREATED).json({
        message: 'Produto adicionado/atualizado no carrinho.',
        item: postItem
    });
};
