import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares/Validation';
import { ProductRepository } from '../../database/Produtos/ProdutoData';
import { CartRepository } from '../../database/Carrinho/CarrinhoData';


export interface IAddToCartBody {
    productId: number;
    quantity: number;
}

export const addToCartValidation = validation((getSchema) => ({
    body: getSchema<IAddToCartBody>(yup.object().shape({
        productId: yup.number().required().defined().moreThan(0),
        quantity: yup.number().required().defined().moreThan(0).integer(),
    })),
}));


export const addToCart = async (req: Request<{}, {}, IAddToCartBody>, res: Response) => {

    const { productId, quantity } = req.body;

    const product = ProductRepository.findByID(productId);

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

    const updatedItem = CartRepository.addItem(product, quantity);

    return res.status(StatusCodes.CREATED).json({
        message: 'Produto adicionado/atualizado no carrinho.',
        item: updatedItem
    });
};
